import axios from 'axios';

export interface AtProtoProfile {
  did: string;
  displayName: string;
  avatar: string;
}

export async function fetchAtProtoProfile(handle: string): Promise<AtProtoProfile> {
  const resp = await axios.get(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`
  );
  const { did, displayName, avatar } = resp.data;
  return { did, displayName, avatar };
}
