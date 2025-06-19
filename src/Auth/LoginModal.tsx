import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

interface Props {
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
  const { login } = useAuth();
  const [input, setInput] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(input);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", padding: 24, borderRadius: 8, minWidth: 300
      }}>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            onChange={handleChange}
            placeholder="Username"
            value={input.username}
            style={{ display: "block", marginBottom: 8, width: "100%" }}
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            value={input.password}
            style={{ display: "block", marginBottom: 8, width: "100%" }}
          />
          <button type="submit" style={{ width: "100%", marginBottom: 8 }}>Login</button>
        </form>
        <button onClick={onClose} style={{ width: "100%" }}>Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
