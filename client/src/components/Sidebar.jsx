import { Home, Search, MessageSquare, Heart, Package, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useChat } from "../contexts/ChatContext";

export default function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { unreadCount } = useChat();

  // Array configuration updated to use translation dictionary dynamic pointer keys
  const menuItems = [
    { icon: Home, labelKey: "navHome", path: "/" },
    { icon: Search, labelKey: "navBrowse", path: "/browse" },
    { icon: MessageSquare, labelKey: "navMessages", path: "/messages", showUnread: true },
    { icon: Heart, labelKey: "navFavorites", path: "/favorites", fallbackLabel: "Favorites" },
    { icon: Package, labelKey: "navMyItems", path: "/my-items", fallbackLabel: "My Items" },
    { icon: User, labelKey: "navProfile", path: "/profile" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed left-0 top-0">
      {/* Brand Logo */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black text-green-800 tracking-tight">EcoLend</h1>
      </div>

      {/* Navigation Links Feed */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.labelKey}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "text-green-700 bg-green-50 font-semibold" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                {/* Dynamically reads translation stream according to active language */}
                <span>{item.fallbackLabel ? item.fallbackLabel : t(item.labelKey)}</span>
              </div>
              {item.showUnread && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-fit">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings at Bottom */}
      <Link
        to="/settings"
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          location.pathname === "/settings"
            ? "text-green-700 bg-green-50 font-semibold"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <Settings size={20} />
        <span>{t('navSettings')}</span>
      </Link>
    </div>
  );
}