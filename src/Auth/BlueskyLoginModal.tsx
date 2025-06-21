import React, { useState } from "react";
import { useBlueskyAuth } from "./BlueskyAuthProvider";
import { Card } from "@/components/ui/card";

interface Props {
  onClose: () => void;
}

const BlueskyLoginModal: React.FC<Props> = ({ onClose }) => {
  const { login, isLoading, error } = useBlueskyAuth();
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      onClose();
    } catch (err) {
      // Error is handled by the auth provider
      console.error("Login failed:", err);
    }
  };

  return (
    <Card style={{
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100vw", 
      height: "100vh",
      background: "rgba(0,0,0,0.5)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      zIndex: 1000,
      backdropFilter: "blur(4px)"
    }}>
      <Card className="w-[30vw] h-[80vh] m-[10vw]">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "24px", 
            fontWeight: "600",
            color: "#1f2937"
          }}>
            Sign in to Bluesky
          </h2>
          <p style={{ 
            margin: 0, 
            color: "#6b7280", 
            fontSize: "14px"
          }}>
            Connect your Bluesky account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Handle or Email
            </label>
            <input
              name="identifier"
              type="text"
              placeholder="alice.bsky.social"
              value={credentials.identifier}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0085ff";
                e.target.style.outline = "none";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              App Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your app password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0085ff";
                e.target.style.outline = "none";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: "#dc2626", 
              marginBottom: "16px", 
              fontSize: "14px",
              padding: "12px",
              backgroundColor: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca"
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "500",
              backgroundColor: isLoading ? "#9ca3af" : "#0085ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              marginBottom: "16px"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#0073e6";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#0085ff";
              }
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <button 
          onClick={onClose}
          style={{
            width: "100%",
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "#6b7280",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Cancel
        </button>

        <div style={{ 
          fontSize: "12px", 
          marginTop: "16px", 
          color: "#9ca3af",
          lineHeight: "1.5",
          textAlign: "center"
        }}>
          <p style={{ margin: "0 0 8px 0" }}>
            Use your Bluesky handle or email and an <strong>app password</strong>.
          </p>
          <p className="text-center ">
            <a 
              href="https://bsky.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#0085ff", textDecoration: "none" }}
            >
              Get a bluesky account
            </a>
            <a 
              href="https://bsky.app/settings/app-passwords" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#0085ff", textDecoration: "none" }}
            >
              Get an app password 
            </a>
          </p>
        </div>
      </Card>
    </Card>
  );
};

export default BlueskyLoginModal; 