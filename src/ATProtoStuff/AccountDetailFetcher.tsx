import axios from 'axios';

export interface AtProtoProfile {
  did: string;
  displayName: string;
  avatar: string;
  handle: string;
  description?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
}

export interface ProfileFetchOptions {
  accessToken?: string;
}

export async function fetchAtProtoProfile(
  handle: string, 
  options: ProfileFetchOptions = {}
): Promise<AtProtoProfile> {
  try {
    const response = await axios.get(
      `https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
      {
        headers: options.accessToken ? {
          'Authorization': `Bearer ${options.accessToken}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      }
    );

    const { did, displayName, avatar, handle: userHandle, description, followersCount, followsCount, postsCount } = response.data;
    
    return { 
      did, 
      displayName: displayName || userHandle, 
      avatar: avatar || '', 
      handle: userHandle,
      description,
      followersCount,
      followsCount,
      postsCount
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error(`Failed to fetch profile for ${handle}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
