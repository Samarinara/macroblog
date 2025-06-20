import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import "./App.css";

import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0InnerProvider } from "./Auth/Auth0Provider";
import ProfileButton from "./Auth/ProfileButton";

import HomePage from "./Home";
import SearchPage from "./Search";
import BlogPage from './Blog';

function App() {
  return(
    <div>
    <BrowserRouter>
      <Auth0Provider
          domain="dev-7np0j1qxafi7ygiv.ca.auth0.com"
          clientId="ZR86tiGSsGS0zv0UtYI8cq15pLL6961n"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://bsky.social",
            scope: "openid profile email"
          }}
          cacheLocation="localstorage"
          useRefreshTokens={true}
      >
        <Auth0InnerProvider>
          <div className='fixed top-[3vh] right-[3vw]'>
            <ProfileButton></ProfileButton>
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/blog/:handle" element={<BlogPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Auth0InnerProvider>
      </Auth0Provider>
    </BrowserRouter>
    </div>
  );
}

export default App;
