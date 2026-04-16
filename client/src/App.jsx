import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'; 
import LendItem from './pages/LendItem'; 

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
          <Route path="/lend" element={<LendItem />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;