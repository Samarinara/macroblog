import axios from 'axios';

export interface MacroblogPost {
  uri: string;
  cid: string;
  value: MacroblogPostLex; // Replace 'any' with your post schema if known
}
export interface MacroblogPostLex {
  title: string;             // maxLength: 120
  text: string;              // maxLength: 20000
  tags?: string[];           // optional
}

export async function fetchMacroblogPosts(handleOrDid: string): Promise<MacroblogPost[]> {
  // First, resolve handle to DID if needed
  let did = handleOrDid;
  if (!did.startsWith('did:')) {
    const profile = await axios.get(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handleOrDid)}`
    );
    did = profile.data.did;
  }

  // Fetch all records of type com.macroblog.blog.post
  const records: MacroblogPost[] = [];
  let cursor: string | undefined = undefined;

  do {
    const resp: { data: { records: MacroblogPost[]; cursor?: string } } = await axios.get(
      'https://public.api.bsky.app/xrpc/com.atproto.repo.listRecords',
      {
        params: {
          repo: did,
          collection: 'com.macroblog.blog.post',
          limit: 100,
          cursor,
        },
      }
    );
    records.push(...resp.data.records);
    cursor = resp.data.cursor;
  } while (cursor);

  return records;
}
