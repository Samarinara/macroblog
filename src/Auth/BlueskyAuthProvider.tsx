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

export const BlueskyAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem("bluesky-access-token") || "");
  const [refreshToken, setRefreshToken] = useState<string>(localStorage.getItem("bluesky-refresh-token") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (did: string) => {
    try {
      const response = await fetch(`${GET_PROFILE_ENDPOINT}?actor=${did}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const profile = await response.json();
        setUser(prev => prev ? {
          ...prev,
          displayName: profile.displayName,
          avatar: profile.avatar
        } : null);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }, [token]);

  const restoreUserFromToken = useCallback(async () => {
    try {
      // Decode JWT to get basic user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData: User = {
        id: payload.did,
        username: payload.handle,
        did: payload.did
      };
      setUser(userData);
      
      // Optionally fetch full profile data
      await fetchUserProfile(userData.did);
    } catch (err) {
      console.error("Failed to restore user from token:", err);
      logout();
    }
  }, [token, fetchUserProfile]);

  // Restore user info from token on load
  useEffect(() => {
    if (token && !user) {
      restoreUserFromToken();
    }
  }, [token, user, restoreUserFromToken]);

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
      localStorage.setItem("bluesky-access-token", data.accessJwt);
      localStorage.setItem("bluesky-refresh-token", data.refreshJwt);
      
      // Set user data
      const userData: User = {
        id: data.did,
        username: data.handle,
        did: data.did
      };
      setUser(userData);
      
      // Fetch full profile
      await fetchUserProfile(data.did);
      
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
    localStorage.removeItem("bluesky-access-token");
    localStorage.removeItem("bluesky-refresh-token");
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
      localStorage.setItem("bluesky-access-token", data.accessJwt);
      localStorage.setItem("bluesky-refresh-token", data.refreshJwt);
      
      // Update user info if needed
      if (data.handle && data.did) {
        setUser(prev => prev ? {
          ...prev,
          username: data.handle,
          did: data.did
        } : null);
      }
      
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
    isLoading,
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