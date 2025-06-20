import { useState } from "react";
import { Button } from '@/components/ui/button'
import { useAuth0Context } from "./Auth0Provider";
import Auth0LoginModal from "./Auth0LoginModal";

export default function ProfileButton() {
  const { user, logout, isLoading } = useAuth0Context();
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
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
          {user.username}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setShowLogin(true)}>
        Sign in with Auth0
      </Button>
      {showLogin && <Auth0LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
