import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import "./App.css";

import { BlueskyAuthProvider } from "./Auth/BlueskyAuthProvider";
import ProfileButton from "./Auth/ProfileButton";
import Navbar from "./customComponents/siteMenu";

import HomePage from "./Home";
import SearchPage from "./Search";
import BlogPage from './Blog';
import PostPage from './Post';
import ProfilePage from './Profile';


function App() {
  return(
    <>
      <div>
      <BrowserRouter>
        <BlueskyAuthProvider>
          <div className='fixed top-[3vh] right-[3vw]'>
            <ProfileButton></ProfileButton>
          </div>
          <div className='fixed top-[3vh] left-[3vw]'>
            <Navbar></Navbar>
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/blog/:handle" element={<BlogPage />} />
            <Route path="/blog/post/:handle/:uri" element={<PostPage />} />
            <Route path="/profile/:handle" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BlueskyAuthProvider>
      </BrowserRouter>
      </div>
      <div className="grid-bg"></div>
    </>
  );
}

export default App;
