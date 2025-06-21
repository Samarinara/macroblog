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
    
    // Transform and validate the records
    const validPosts = fetchedRecords
      .filter((record: { value: MacroblogPostLex }) => record.value && record.value.title && record.value.text)
      .map((record: { uri: string; cid: string; value: MacroblogPostLex }) => ({
        uri: record.uri,
        cid: record.cid,
        value: {
          title: record.value.title,
          text: record.value.text,
          tags: record.value.tags || [],
          createdAt: record.value.createdAt || new Date().toISOString()
        }
      }));

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
    const response = await axios.get(
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
          cid: undefined // Will be resolved by the server
        },
      }
    );

    const record = response.data.value;
    return {
      uri: response.data.uri,
      cid: response.data.cid,
      value: {
        title: record.title,
        text: record.text,
        tags: record.tags || [],
        createdAt: record.createdAt || new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error fetching macroblog post:', error);
    throw new Error(`Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
