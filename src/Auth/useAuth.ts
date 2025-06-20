// Unified auth hook that can work with either AuthProvider or Auth0Provider
// This allows for easy switching between authentication systems

import { useAuth as useOldAuth } from "./AuthProvider";
import { useAuth0Context } from "./Auth0Provider";

// You can change this to switch between auth systems
const USE_AUTH0 = true;

export const useAuth = () => {
  // Always call both hooks to satisfy React hooks rules
  const auth0Context = useAuth0Context();
  const oldAuth = useOldAuth();
  
  if (USE_AUTH0) {
    return {
      user: auth0Context.user,
      token: auth0Context.token,
      login: auth0Context.login,
      logout: auth0Context.logout,
      isLoading: auth0Context.isLoading,
      error: auth0Context.error,
      // For backward compatibility with old auth system
      refresh: async () => {
        // Auth0 handles token refresh automatically
        console.log("Auth0 handles token refresh automatically");
      }
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