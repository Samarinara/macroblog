import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  username: string;
  did: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem("site-access-token") || "");
  const [refreshToken, setRefreshToken] = useState<string>(localStorage.getItem("site-refresh-token") || "");

  // Restore user info from token (decode or fetch) on load
  useEffect(() => {
    if (token && !user) {
      // Option 1: Decode JWT for user info (simplest)
      // Option 2: Fetch user profile using token (more robust)
      // Here, we'll decode the JWT for handle and did
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.did, username: payload.handle, did: payload.did });
      } catch {
        setUser(null);
      }
    }
  }, [token, user]);

  // Login: store tokens and user info
  const login = async (credentials: { identifier: string; password: string }) => {
    const res = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setUser({ id: data.did, username: data.handle, did: data.did });
    setToken(data.accessJwt);
    setRefreshToken(data.refreshJwt);
    localStorage.setItem("site-access-token", data.accessJwt);
    localStorage.setItem("site-refresh-token", data.refreshJwt);
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    setToken("");
    setRefreshToken("");
    localStorage.removeItem("site-access-token");
    localStorage.removeItem("site-refresh-token");
  };

  // Refresh access token using refresh token
  const refresh = async () => {
    if (!refreshToken) return logout();
    const res = await fetch("https://bsky.social/xrpc/com.atproto.server.refreshSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshJwt: refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      logout();
      throw new Error(data.message || "Session refresh failed");
    }
    setToken(data.accessJwt);
    setRefreshToken(data.refreshJwt);
    localStorage.setItem("site-access-token", data.accessJwt);
    localStorage.setItem("site-refresh-token", data.refreshJwt);
    // Optionally update user info
    setUser({ id: data.did, username: data.handle, did: data.did });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
