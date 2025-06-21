/* import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

/*   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(input);
  }; */

/*   return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}  */
