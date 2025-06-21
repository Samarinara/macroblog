// Unified auth hook that can work with either AuthProvider or BlueskyAuthProvider
// This allows for easy switching between authentication systems

import { useAuth as useOldAuth } from "./AuthProvider";
import { useBlueskyAuth } from "./BlueskyAuthProvider";

// You can change this to switch between auth systems
const USE_BLUESKY_AUTH = true;

export const useAuth = () => {
  // Always call both hooks to satisfy React hooks rules
  const blueskyAuth = useBlueskyAuth();
  const oldAuth = useOldAuth();
  
  if (USE_BLUESKY_AUTH) {
    return {
      user: blueskyAuth.user,
      token: blueskyAuth.token,
      login: blueskyAuth.login,
      logout: blueskyAuth.logout,
      isLoading: blueskyAuth.isLoading,
      error: blueskyAuth.error,
      refresh: blueskyAuth.refresh
    };
  } else {
    return {
      user: oldAuth.user,
      token: oldAuth.token,
      login: oldAuth.login,
      logout: oldAuth.logout,
      isLoading: false, // Old auth doesn't have loading state
      error: null, // Old auth doesn't have error state
      refresh: oldAuth.refresh
    };
  }
}; 