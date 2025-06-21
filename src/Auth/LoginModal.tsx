import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

import { Button } from '@/components/ui/button'


interface Props {
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
  const { login } = useAuth();
  const [input, setInput] = useState({ identifier: "", password: "" });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(input);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Check credentials and app password.";
      setError(errorMessage);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: 24, borderRadius: 8, minWidth: 300, boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>
        <form onSubmit={handleSubmit}>
          <input
            name="identifier"
            placeholder="Handle (@bob.bsky.social)"
            onChange={handleChange}
            value={input.identifier}
            style={{ display: "block", marginBottom: 8, width: "100%" }}
            autoFocus
          />
          <input
            name="password"
            type="password"
            placeholder="App Password"
            onChange={handleChange}
            value={input.password}
            style={{ display: "block", marginBottom: 8, width: "100%" }}
          />
          <Button type="submit" style={{ width: "100%", marginBottom: 8 }}>Login</Button>
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        </form>
        <Button onClick={onClose} style={{ width: "100%" }}>Close</Button>
        <div style={{ fontSize: 12, marginTop: 8, color: "#555" }}>
          Use your Bluesky handle or email and an <b>app password</b> (not your main password).<br />
          <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer">
            Get an app password
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
