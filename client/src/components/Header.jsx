import { Search, Bell, Plus, User, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";

export default function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  
  // 1. Safe parsing of user data
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 2. Logic to get the Initial safely
  // This checks for .name, then .full_name, then defaults to "U"
  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.full_name) return user.full_name.charAt(0).toUpperCase();
    return "U";
  };

  const getDisplayName = () => {
    return user?.name || user?.full_name || "User";
  };

  return (
    <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search for tools, cameras, or gear..."
          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-green-800 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 ml-4">
        <Link 
          to="/lend" 
          className="bg-green-800 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-green-900 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:block">List Item</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-all">
              <div className="w-9 h-9 bg-green-100 text-green-900 rounded-full flex items-center justify-center font-black border-2 border-green-200">
                {getInitial()}
              </div>
              <span className="hidden md:block font-bold text-sm text-gray-700">
                {getDisplayName()}
              </span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-green-800"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 text-sm font-bold bg-green-900 text-white rounded-full hover:bg-black transition-all shadow-md"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}