import { Search, Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search tools, bikes, gear..."
          className="w-full bg-gray-100 border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-green-600 outline-none transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 ml-4">
        <Link 
          to="/lend" 
          className="bg-green-800 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-green-900 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>List Item</span>
        </Link>
        
        <button className="text-gray-500 hover:text-green-800 relative">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}