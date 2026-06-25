import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SearchProvider } from "./contexts/SearchContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import LendItem from "./pages/LendItem";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ItemDetail from "./pages/ItemDetail";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";  
import Browse from "./pages/Browse";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import { LanguageProvider } from "./contexts/LanguageContext";


// Utility: check if user is logged in
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Protected Route wrapper
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  
  // Pages where we DON'T want the sidebar (like Login/Register)
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <LanguageProvider>
    <SearchProvider>
      <div className="flex min-h-screen bg-gray-50">
        {!isAuthPage && <Sidebar />}

        <div className={`flex-1 flex flex-col ${!isAuthPage ? "ml-64" : ""}`}>
          {!isAuthPage && <Header />}
          
          <main className={isAuthPage ? "" : "p-8"}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lend" element={<LendItem />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/browse" element={<Browse />}  />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
               
            </Routes>
          </main>
        </div>
      </div>
    </SearchProvider>
    </LanguageProvider>
  );
}

export default App;