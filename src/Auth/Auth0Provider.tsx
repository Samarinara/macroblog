import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Auth0Provider as Auth0ReactProvider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "../config/auth0";

interface User {
  id: string;
  username: string;
  did: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inner component that uses Auth0 hooks
export const Auth0InnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    user: auth0User, 
    isAuthenticated, 
    isLoading, 
    error,
    loginWithPopup, 
    logout: auth0Logout,
    getAccessTokenSilently 
  } = useAuth0();
  
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Convert Auth0 user to our User format and get Bluesky token
  useEffect(() => {
    const setupUser = async () => {
      if (isAuthenticated && auth0User) {
        try {
          // Get the access token from Auth0
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          
          // Convert Auth0 user to our format
          // You might need to adjust this based on your Auth0 user profile
          const userData: User = {
            id: auth0User.sub || auth0User.user_id || "",
            username: auth0User.nickname || auth0User.email || "",
            did: auth0User.sub || auth0User.user_id || "" // Use Auth0 sub as DID
          };
          
          setUser(userData);
          setAuthError(null);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Failed to get user token";
          setAuthError(errorMessage);
          console.error("Auth0 token error:", err);
        }
      } else {
        setUser(null);
        setToken("");
      }
    };

    setupUser();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  // Handle Auth0 errors
  useEffect(() => {
    if (error) {
      setAuthError(error.message || "Authentication error");
    }
  }, [error]);

  const login = async () => {
    try {
      setAuthError(null);
      await loginWithPopup();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setAuthError(errorMessage);
      console.error("Login error:", err);
    }
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    error: authError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Main Auth0 Provider component
export const Auth0Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Auth0ReactProvider {...auth0Config}>
      <Auth0InnerProvider>
        {children}
      </Auth0InnerProvider>
    </Auth0ReactProvider>
  );
};

export const useAuth0Context = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth0Context must be used within Auth0Provider");
  return ctx;
}; 