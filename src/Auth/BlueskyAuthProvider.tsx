import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  username: string;
  did: string;
  displayName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bluesky API endpoints
const BLUESKY_API_BASE = "https://bsky.social";
const CREATE_SESSION_ENDPOINT = `${BLUESKY_API_BASE}/xrpc/com.atproto.server.createSession`;
const REFRESH_SESSION_ENDPOINT = `${BLUESKY_API_BASE}/xrpc/com.atproto.server.refreshSession`;
const GET_PROFILE_ENDPOINT = `${BLUESKY_API_BASE}/xrpc/app.bsky.actor.getProfile`;

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "bluesky-access-token",
  REFRESH_TOKEN: "bluesky-refresh-token",
  USER_DATA: "bluesky-user-data",
  AUTH_EVENT: "bluesky-auth-event"
} as const;

// Custom event for cross-tab communication
const AUTH_EVENT_NAME = "bluesky-auth-change";

export const BlueskyAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setIsInitialized] = useState(false);

  // Helper function to save user data to localStorage
  const saveUserData = useCallback((userData: User | null) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }, []);

  // Helper function to load user data from localStorage
  const loadUserData = useCallback((): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error("Failed to load user data from localStorage:", err);
      return null;
    }
  }, []);

  // Helper function to trigger cross-tab events
  const triggerAuthEvent = useCallback((eventType: 'login' | 'logout' | 'refresh') => {
    const eventData = {
      type: eventType,
      timestamp: Date.now(),
      tabId: Math.random().toString(36).substr(2, 9)
    };
    
    // Store event in localStorage for other tabs to detect
    localStorage.setItem(STORAGE_KEYS.AUTH_EVENT, JSON.stringify(eventData));
    
    // Dispatch custom event for same-tab listeners
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: eventData }));
    
    // Clear the event after a short delay to prevent accumulation
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.AUTH_EVENT);
    }, 1000);
  }, []);

  // Helper function to check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
      
      return currentTime >= (expirationTime - bufferTime);
    } catch (err) {
      console.error("Failed to check token expiration:", err);
      return true; // Assume expired if we can't decode
    }
  }, []);

  const fetchUserProfile = useCallback(async (did: string, accessToken: string) => {
    try {
      const response = await fetch(`${GET_PROFILE_ENDPOINT}?actor=${did}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const profile = await response.json();
        const updatedUser = {
          id: did,
          username: profile.handle || did,
          did: did,
          displayName: profile.displayName,
          avatar: profile.avatar
        };
        
        setUser(updatedUser);
        saveUserData(updatedUser);
        return updatedUser;
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
    return null;
  }, [saveUserData]);

  const restoreUserFromToken = useCallback(async (accessToken: string) => {
    try {
      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        console.log("Token is expired, attempting refresh...");
        return false;
      }

      // Decode JWT to get basic user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      
      console.log("JWT Payload:", payload);
      console.log("Payload did:", payload.did);
      console.log("Payload handle:", payload.handle);
      
      // Validate that the payload has the required fields
      if (!payload.did || !payload.handle) {
        console.error("Invalid token payload - missing required fields:", payload);
        return false;
      }
      
      const userData: User = {
        id: payload.did,
        username: payload.handle,
        did: payload.did
      };
      
      console.log("Restoring user from token:", userData);
      setToken(accessToken);
      
      // Try to load cached user data first
      const cachedUser = loadUserData();
      if (cachedUser && cachedUser.did === payload.did) {
        console.log("Using cached user data:", cachedUser);
        setUser(cachedUser);
      } else {
        // Only set basic user data if we don't have cached data
        setUser(userData);
      }
      
      // Fetch fresh profile data
      const freshUser = await fetchUserProfile(userData.did, accessToken);
      if (freshUser) {
        console.log("Fetched fresh user profile:", freshUser);
      }
      return true;
    } catch (err) {
      console.error("Failed to restore user from token:", err);
      return false;
    }
  }, [isTokenExpired, loadUserData, fetchUserProfile]);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("=== INITIALIZING AUTH ===");
      const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      console.log("Stored token:", storedToken ? "Present" : "Missing");
      console.log("Stored refresh token:", storedRefreshToken ? "Present" : "Missing");
      
      if (storedToken && storedRefreshToken) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        
        // Try to load cached user data first for immediate display
        const cachedUser = loadUserData();
        if (cachedUser) {
          console.log("Loading cached user data:", cachedUser);
          setUser(cachedUser);
          
          // Only try to restore from token if we need to refresh the data
          // or if the cached data seems incomplete
          if (!cachedUser.displayName || !cachedUser.avatar) {
            console.log("Cached user data incomplete, attempting token restoration...");
            const restored = await restoreUserFromToken(storedToken);
            if (!restored) {
              // Token is expired, try to refresh
              try {
                console.log("Token expired, attempting refresh...");
                await refresh();
              } catch (err) {
                console.error("Failed to refresh expired token:", err);
                logout();
              }
            }
          } else {
            console.log("Using complete cached user data, skipping token restoration");
          }
        } else {
          // No cached data, try to restore from token
          const restored = await restoreUserFromToken(storedToken);
          if (!restored) {
            // Token is expired, try to refresh
            try {
              console.log("Token expired, attempting refresh...");
              await refresh();
            } catch (err) {
              console.error("Failed to refresh expired token:", err);
              logout();
            }
          }
        }
      } else {
        // Try to load cached user data even without tokens
        const cachedUser = loadUserData();
        if (cachedUser) {
          console.log("Loading cached user data (no tokens):", cachedUser);
          setUser(cachedUser);
        }
      }
      
      console.log("=== AUTH INITIALIZATION COMPLETE ===");
      setIsInitialized(true);
    };

    initializeAuth();
  }, [restoreUserFromToken, loadUserData]);

  // Set up cross-tab event listeners
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.AUTH_EVENT && e.newValue) {
        try {
          const eventData = JSON.parse(e.newValue);
          handleAuthEvent(eventData);
        } catch (err) {
          console.error("Failed to parse auth event:", err);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      handleAuthEvent(e.detail);
    };

    const handleAuthEvent = (eventData: any) => {
      switch (eventData.type) {
        case 'login':
          // Another tab logged in, refresh our state
          const newToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const newRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (newToken && newRefreshToken) {
            setToken(newToken);
            setRefreshToken(newRefreshToken);
            restoreUserFromToken(newToken);
          }
          break;
        case 'logout':
          // Another tab logged out, clear our state
          logout();
          break;
        case 'refresh':
          // Another tab refreshed tokens, update our state
          const refreshedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const refreshedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshedToken && refreshedRefreshToken) {
            setToken(refreshedToken);
            setRefreshToken(refreshedRefreshToken);
          }
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AUTH_EVENT_NAME, handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_EVENT_NAME, handleCustomEvent as EventListener);
    };
  }, [restoreUserFromToken]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!token || !refreshToken) return;

    const checkAndRefreshToken = async () => {
      if (isTokenExpired(token)) {
        try {
          await refresh();
        } catch (err) {
          console.error("Automatic token refresh failed:", err);
          logout();
        }
      }
    };

    // Check immediately
    checkAndRefreshToken();

    // Set up interval to check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, refreshToken, isTokenExpired]);

  const login = async (credentials: { identifier: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("=== BLUESKY LOGIN DEBUG ===");
      console.log("Endpoint:", CREATE_SESSION_ENDPOINT);
      console.log("Attempting login with credentials:", {
        identifier: credentials.identifier,
        password: credentials.password ? "[REDACTED]" : "undefined"
      });

      // Validate credentials
      if (!credentials.identifier || !credentials.password) {
        throw new Error("Both identifier and password are required");
      }

      const requestBody = {
        identifier: credentials.identifier.trim(),
        password: credentials.password
      };

      console.log("Request body:", { ...requestBody, password: "[REDACTED]" });

      const response = await fetch(CREATE_SESSION_ENDPOINT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log("Response text:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(`Server returned invalid JSON: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error("Login failed with status:", response.status);
        console.error("Error response:", data);
        
        // Handle specific error cases
        if (response.status === 400) {
          if (data.error === "InvalidPassword") {
            throw new Error("Invalid password. Please check your app password.");
          } else if (data.error === "InvalidIdentifier") {
            throw new Error("Invalid identifier. Please check your handle or email.");
          } else {
            throw new Error(data.message || data.error || "Invalid request format");
          }
        } else if (response.status === 401) {
          throw new Error("Authentication failed. Please check your credentials.");
        } else if (response.status === 429) {
          throw new Error("Too many login attempts. Please try again later.");
        } else {
          throw new Error(data.message || data.error || `HTTP ${response.status}: ${responseText}`);
        }
      }
      
      console.log("Login successful, received data:", {
        did: data.did,
        handle: data.handle,
        hasAccessJwt: !!data.accessJwt,
        hasRefreshJwt: !!data.refreshJwt
      });
      
      // Store tokens
      setToken(data.accessJwt);
      setRefreshToken(data.refreshJwt);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessJwt);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshJwt);
      
      // Set user data
      const userData: User = {
        id: data.did,
        username: data.handle,
        did: data.did
      };
      setUser(userData);
      saveUserData(userData);
      
      // Fetch full profile
      await fetchUserProfile(data.did, data.accessJwt);
      
      // Trigger cross-tab event
      triggerAuthEvent('login');
      
      console.log("=== LOGIN COMPLETE ===");
      
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setRefreshToken("");
    setError(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Trigger cross-tab event
    triggerAuthEvent('logout');
  };

  const refresh = async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    
    try {
      const response = await fetch(REFRESH_SESSION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshJwt: refreshToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        logout();
        throw new Error(data.message || "Session refresh failed");
      }
      
      setToken(data.accessJwt);
      setRefreshToken(data.refreshJwt);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessJwt);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshJwt);
      
      // Update user info if needed
      if (data.handle && data.did) {
        setUser(prev => prev ? {
          ...prev,
          username: data.handle,
          did: data.did
        } : null);
      }
      
      // Trigger cross-tab event
      triggerAuthEvent('refresh');
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Session refresh failed";
      setError(errorMessage);
      logout();
      throw err;
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading: isLoading, // Only show loading during actual login/refresh operations
    error,
    refresh
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useBlueskyAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useBlueskyAuth must be used within BlueskyAuthProvider");
  return ctx;
}; 