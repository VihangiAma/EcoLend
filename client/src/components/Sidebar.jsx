import { Home, Search, MessageSquare, Heart, Package, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Browse", path: "/browse" },
  { icon: MessageSquare, label: "Messages", path: "/messages", badge: 3 },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: Package, label: "My Items", path: "/my-items" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed left-0 top-0">
      {/* Brand Logo */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black text-green-800 tracking-tight">EcoLend</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? "text-green-700 bg-green-50 font-semibold" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full text-black">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Settings at Bottom */}
      <Link
        to="/settings"
        className="flex items-center gap-3 px-4 py-3 text-green-800 bg-green-50 rounded-xl font-semibold"
      >
        <Settings size={20} />
        <span>Settings</span>
      </Link>
    </div>
  );
}