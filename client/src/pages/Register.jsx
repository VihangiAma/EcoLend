import React, { useState } from 'react';
import API from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', formData);
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-light px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-eco-green mb-6 text-center">Join EcoLend</h2>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Full Name" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-eco-green"
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
          />
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-eco-green"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-eco-green"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button className="w-full bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
            Create Account
          </button>
        </div>
        
        {message && <p className="mt-4 text-center text-sm font-medium text-eco-green">{message}</p>}
      </form>
    </div>
  );
};

export default Register;