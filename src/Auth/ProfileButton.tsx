import { useState } from "react";
import { Button } from '@/components/ui/button'
import { useBlueskyAuth } from "./BlueskyAuthProvider";
import BlueskyLoginModal from "./BlueskyLoginModal";

export default function ProfileButton() {
  const { user, logout, isLoading } = useBlueskyAuth();
  const [showLogin, setShowLogin] = useState(false);

  // Show loading only if we're actively loading AND we don't have user data
  const shouldShowLoading = isLoading && !user;

  if (shouldShowLoading) {
    return (
      <Button disabled>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button onClick={logout} variant="neutral">
          Logout
        </Button>
        <Button>
          {user.displayName || user.username}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setShowLogin(true)}>
        Sign in to Bluesky
      </Button>
      {showLogin && <BlueskyLoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
} 

