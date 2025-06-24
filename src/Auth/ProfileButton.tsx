import { useState } from "react";
import { Button } from '@/components/ui/button'
import { useBlueskyAuth } from "./BlueskyAuthProvider";
import BlueskyLoginModal from "./BlueskyLoginModal";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useNavigate } from 'react-router-dom';
import { ProfilePicture } from "../Search";


export default function ProfileButton() {
  const { user, logout, isLoading } = useBlueskyAuth();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();


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
        <Menubar >
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-2 overflow-hidden">

              <ProfilePicture handle={user.username}></ProfilePicture>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => navigate('/Profile/@'+user.username+'')}>
                Profile
              </MenubarItem>
              <MenubarItem onClick={logout}>
                Log out
              </MenubarItem>
              <MenubarItem onClick={() => navigate('/home')}>
                Reading
              </MenubarItem>
              <MenubarSeparator></MenubarSeparator>
              <MenubarItem onClick={() => navigate('/search')}>
                Manage My Blog
              </MenubarItem>
              <MenubarItem onClick={() => navigate('/home')}>
                Write a Post
              </MenubarItem>              
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
