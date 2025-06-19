import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import "./App.css";

import HomePage from "./Home";
import SearchPage from "./Search";


function App() {
  return(
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}


export default App;
