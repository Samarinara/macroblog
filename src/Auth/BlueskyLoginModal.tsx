import React, { useState } from "react";
import { useBlueskyAuth } from "./BlueskyAuthProvider";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to Bluesky</CardTitle>
        <CardDescription>
          Connect your Bluesky account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="identifier">Handle or Email</Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="alice.bsky.social"
              value={credentials.identifier}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">App Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your app password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="neutral"
          className="w-full"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <div className="mt-4 text-center text-xs text-gray-400 leading-6 w-[90%] mx-auto">
          <p>
            Use your Bluesky handle or email and an <strong>app password</strong>.
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <a
              href="https://bsky.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get a Bluesky account
            </a>
            <a
              href="https://bsky.app/settings/app-passwords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get an app password
            </a>
          </div>
        </div>
      </CardFooter>
    </Card>
  </div>
);
}


export default BlueskyLoginModal; 