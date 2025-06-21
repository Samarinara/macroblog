import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import "./App.css";

import { BlueskyAuthProvider } from "./Auth/BlueskyAuthProvider";
import ProfileButton from "./Auth/ProfileButton";

import HomePage from "./Home";
import SearchPage from "./Search";
import BlogPage from './Blog';

function App() {
  return(
    <div>
    <BrowserRouter>
      <BlueskyAuthProvider>
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
      </BlueskyAuthProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
