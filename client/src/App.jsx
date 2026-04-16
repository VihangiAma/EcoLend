import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'; // <--- Add this import

function App() {
  return (
    <div className="min-h-screen bg-eco-light">
      <Navbar />
      
      {/* pt-[72px] ensures content doesn't hide behind the navbar */}
      <div className="pt-[72px]">
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;