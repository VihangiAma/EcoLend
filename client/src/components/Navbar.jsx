import React from 'react';
import { Leaf, Search, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 h-[72px] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Leaf className="text-ecoGreen" size={28} />
        <span className="text-2xl font-bold text-ecoGreen tracking-tight">EcoLend</span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 mx-10 max-w-md relative">
        <input 
          type="text" 
          placeholder="Search for tools, electronics..." 
          className="w-full bg-ecoLight border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-ecoGreen outline-none text-sm"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-6 text-gray-600">
  {/* Navigation Links */}
  <Link to="/" className="hover:text-eco-green transition">Explore</Link>
  
  <MessageSquare className="hover:text-eco-green cursor-pointer" size={22} />
  <Link 
  to="/lend" 
  className="bg-eco-green text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
>
  + Lend Item
</Link>

  {/* Login Link */}
  <Link to="/login" className="text-sm font-medium hover:text-eco-green transition">
    Login
  </Link>

  {/* Join Now Button */}
  <Link 
    to="/register" 
    className="flex items-center gap-2 bg-eco-green text-white px-5 py-2 rounded-full hover:bg-opacity-90 transition shadow-sm"
  >
    <User size={18} />
    <span className="text-sm font-bold">Join Now</span>
  </Link>
</div>
    </nav>
  );
};

export default Navbar;