/* import React, { useState } from "react";
import { useAuth0Context } from "./Auth0Provider";
import { Button } from '@/components/ui/button'


interface Props {
  onClose: () => void;
}

const Auth0LoginModal: React.FC<Props> = ({ onClose }) => {
  const { login, isLoading, error } = useAuth0Context();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
      onClose();
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100vw", 
      height: "100vh",
      background: "rgba(0,0,0,0.3)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff", 
        padding: 32, 
        borderRadius: 12, 
        minWidth: 350, 
        maxWidth: 400,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}>
        <h2 style={{ 
          margin: "0 0 16px 0", 
          fontSize: "24px", 
          fontWeight: "600",
          color: "#1a1a1a"
        }}>
          Sign in to Bluesky
        </h2>
        
        <p style={{ 
          margin: "0 0 24px 0", 
          color: "#666", 
          fontSize: "14px",
          lineHeight: "1.5"
        }}>
          Connect your Bluesky account using Auth0 for secure authentication
        </p>

        <Button 
          onClick={handleLogin}
          disabled={isLoading || isLoggingIn}
          style={{

          }}
          onMouseEnter={(e) => {
            if (!isLoading && !isLoggingIn) {
              e.currentTarget.style.backgroundColor = "#0073e6";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !isLoggingIn) {
              e.currentTarget.style.backgroundColor = "#0085ff";
            }
          }}
        >
          {isLoading || isLoggingIn ? (
            <span>Signing in...</span>
          ) : (
            <span>Sign in with Auth0</span>
          )}
        </Button>

        {error && (
          <div style={{ 
            color: "#dc2626", 
            marginBottom: "16px", 
            fontSize: "14px",
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            borderRadius: "6px",
            border: "1px solid #fecaca"
          }}>
            {error}
          </div>
        )}

        <Button 
          onClick={onClose}

          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Cancel
        </Button>

        <div style={{ 
          fontSize: "12px", 
          marginTop: "16px", 
          color: "#888",
          lineHeight: "1.4"
        }}>
          <p style={{ margin: "0 0 8px 0" }}>
            This will open a popup window for secure authentication.
          </p>
          <p style={{ margin: 0 }}>
            Make sure popups are enabled for this site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth0LoginModal;  */