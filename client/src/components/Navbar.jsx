import React from 'react';
import { Leaf, Search, User, MessageSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
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
        <button className="hover:text-ecoGreen transition">Explore</button>
        <MessageSquare className="hover:text-ecoGreen cursor-pointer" size={22} />
        <div className="flex items-center gap-1 cursor-pointer hover:text-ecoGreen transition">
          <User size={22} />
          <span className="text-sm font-medium">Login</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;