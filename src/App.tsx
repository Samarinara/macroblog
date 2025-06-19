import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import "./App.css";

import { AuthProvider, useAuth } from "./Auth/AuthProvider";
import LoginModal from "./Auth/LoginModal";

import HomePage from "./Home";
import SearchPage from "./Search";
import BlogPage from './Blog';

function App() {
  return(
    <div>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/blog/:handle" element={<BlogPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </div>
  );
}


export default App;
