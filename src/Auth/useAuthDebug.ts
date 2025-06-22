import { useEffect, useState } from 'react';

interface AuthDebugInfo {
  isInitialized: boolean;
  hasToken: boolean;
  hasRefreshToken: boolean;
  hasUserData: boolean;
  tokenExpiry: string | null;
  lastAuthEvent: string | null;
  tabId: string;
}

export const useAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    isInitialized: false,
    hasToken: false,
    hasRefreshToken: false,
    hasUserData: false,
    tokenExpiry: null,
    lastAuthEvent: null,
    tabId: Math.random().toString(36).substr(2, 9)
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const token = localStorage.getItem("bluesky-access-token");
      const refreshToken = localStorage.getItem("bluesky-refresh-token");
      const userData = localStorage.getItem("bluesky-user-data");
      const authEvent = localStorage.getItem("bluesky-auth-event");

      let tokenExpiry = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = new Date(payload.exp * 1000);
          tokenExpiry = expirationTime.toLocaleString();
        } catch (err) {
          tokenExpiry = "Invalid token";
        }
      }

      setDebugInfo({
        isInitialized: true,
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData,
        tokenExpiry,
        lastAuthEvent: authEvent ? JSON.parse(authEvent).type : null,
        tabId: debugInfo.tabId
      });
    };

    // Update immediately
    updateDebugInfo();

    // Set up interval to update every 2 seconds
    const interval = setInterval(updateDebugInfo, 2000);

    // Listen for storage changes
    const handleStorageChange = () => {
      updateDebugInfo();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [debugInfo.tabId]);

  return debugInfo;
};

// Utility function to clear all auth data (for testing)
export const clearAuthData = () => {
  localStorage.removeItem("bluesky-access-token");
  localStorage.removeItem("bluesky-refresh-token");
  localStorage.removeItem("bluesky-user-data");
  localStorage.removeItem("bluesky-auth-event");
  console.log("All auth data cleared");
};

// Utility function to log current auth state
export const logAuthState = () => {
  const token = localStorage.getItem("bluesky-access-token");
  const refreshToken = localStorage.getItem("bluesky-refresh-token");
  const userData = localStorage.getItem("bluesky-user-data");
  
  console.log("=== AUTH STATE DEBUG ===");
  console.log("Access Token:", token ? "Present" : "Missing");
  console.log("Refresh Token:", refreshToken ? "Present" : "Missing");
  console.log("User Data:", userData ? JSON.parse(userData) : "Missing");
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = new Date(payload.exp * 1000);
      console.log("Token Expires:", expirationTime.toLocaleString());
      console.log("Token Payload:", payload);
    } catch (err) {
      console.log("Token is invalid");
    }
  }
  console.log("========================");
}; 