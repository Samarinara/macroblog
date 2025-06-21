import axios from 'axios';

export interface MacroblogPost {
  uri: string;
  cid: string;
  value: MacroblogPostLex;
}

export interface MacroblogPostLex {
  title: string;             // maxLength: 120
  text: string;              // maxLength: 20000
  tags?: string[];           // optional
  createdAt: string;         // ISO timestamp
}

export interface PostFetchOptions {
  accessToken?: string;
  limit?: number;
  cursor?: string;
}

export async function fetchMacroblogPosts(
  handleOrDid: string, 
  options: PostFetchOptions = {}
): Promise<{ posts: MacroblogPost[]; cursor?: string }> {
  try {
    // First, resolve handle to DID if needed
    let did = handleOrDid;
    if (!did.startsWith('did:')) {
      const profileResponse = await axios.get(
        `https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handleOrDid)}`,
        {
          headers: options.accessToken ? {
            'Authorization': `Bearer ${options.accessToken}`
          } : {}
        }
      );
      did = profileResponse.data.did;
    }

    // Fetch records of type com.macroblog.blog.post
    const limit = options.limit || 20;
    const cursor = options.cursor;

    const response = await axios.get(
      'https://bsky.social/xrpc/com.atproto.repo.listRecords',
      {
        headers: options.accessToken ? {
          'Authorization': `Bearer ${options.accessToken}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        },
        params: {
          repo: did,
          collection: 'com.macroblog.blog.post',
          limit,
          cursor,
        },
      }
    );

    const { records: fetchedRecords, cursor: nextCursor } = response.data;
    
    console.log('Fetched records:', fetchedRecords);
    
    // Transform and validate the records
    const validPosts = fetchedRecords
      .filter((record: { value: MacroblogPostLex }) => record.value && record.value.title && record.value.text)
      .map((record: { uri: string; cid: string; value: MacroblogPostLex }) => {
        console.log('Record URI:', record.uri);
        return {
          uri: record.uri,
          cid: record.cid,
          value: {
            title: record.value.title,
            text: record.value.text,
            tags: record.value.tags || [],
            createdAt: record.value.createdAt || new Date().toISOString()
          }
        };
      });

    return {
      posts: validPosts,
      cursor: nextCursor
    };

  } catch (error) {
    console.error('Error fetching macroblog posts:', error);
    throw new Error(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fetch a single post by URI
export async function fetchMacroblogPost(
  uri: string, 
  options: PostFetchOptions = {}
): Promise<MacroblogPost> {
  try {
    console.log('Attempting to fetch post with URI:', uri);
    
    // Parse the URI to extract DID and record key
    // URI format: at://did:plc:.../com.macroblog.blog.post/...
    const uriParts = uri.split('/');
    if (uriParts.length < 4) {
      throw new Error('Invalid URI format');
    }
    
    const did = uriParts[2]; // did:plc:...
    const recordKey = uriParts[3]; // com.macroblog.blog.post/...
    
    console.log('Parsed DID:', did);
    console.log('Parsed record key:', recordKey);
    
    // Try to use getRecord first (more efficient)
    try {
      const getRecordResponse = await axios.get(
        'https://bsky.social/xrpc/com.atproto.repo.getRecord',
        {
          headers: options.accessToken ? {
            'Authorization': `Bearer ${options.accessToken}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          },
          params: {
            uri: uri,
          },
        }
      );

      const record = getRecordResponse.data.value;
      return {
        uri: getRecordResponse.data.uri,
        cid: getRecordResponse.data.cid,
        value: {
          title: record.title,
          text: record.text,
          tags: record.tags || [],
          createdAt: record.createdAt || new Date().toISOString()
        }
      };
    } catch (getRecordError) {
      console.log('getRecord failed, falling back to listRecords:', getRecordError);
      
      // Fallback to listRecords approach
      const response = await axios.get(
        'https://bsky.social/xrpc/com.atproto.repo.listRecords',
        {
          headers: options.accessToken ? {
            'Authorization': `Bearer ${options.accessToken}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          },
          params: {
            repo: did,
            collection: 'com.macroblog.blog.post',
            limit: 100, // Fetch more records to ensure we find the target
          },
        }
      );

      const { records } = response.data;
      console.log('Found records:', records.length);
      
      // Find the record that matches our URI
      const targetRecord = records.find((record: any) => record.uri === uri);
      
      if (!targetRecord) {
        // If not found in first batch, try with pagination
        console.log('Post not found in first batch, trying with pagination...');
        let cursor = response.data.cursor;
        
        while (cursor) {
          const nextResponse = await axios.get(
            'https://bsky.social/xrpc/com.atproto.repo.listRecords',
            {
              headers: options.accessToken ? {
                'Authorization': `Bearer ${options.accessToken}`,
                'Content-Type': 'application/json'
              } : {
                'Content-Type': 'application/json'
              },
              params: {
                repo: did,
                collection: 'com.macroblog.blog.post',
                limit: 100,
                cursor: cursor,
              },
            }
          );
          
          const nextRecords = nextResponse.data.records;
          const foundRecord = nextRecords.find((record: any) => record.uri === uri);
          
          if (foundRecord) {
            const record = foundRecord.value;
            return {
              uri: foundRecord.uri,
              cid: foundRecord.cid,
              value: {
                title: record.title,
                text: record.text,
                tags: record.tags || [],
                createdAt: record.createdAt || new Date().toISOString()
              }
            };
          }
          
          cursor = nextResponse.data.cursor;
        }
        
        throw new Error(`Post not found with URI: ${uri}`);
      }

      const record = targetRecord.value;
      return {
        uri: targetRecord.uri,
        cid: targetRecord.cid,
        value: {
          title: record.title,
          text: record.text,
          tags: record.tags || [],
          createdAt: record.createdAt || new Date().toISOString()
        }
      };
    }

  } catch (error) {
    console.error('Error fetching macroblog post:', error);
    throw new Error(`Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
