import { Routes, Route, useLocation } from "react-router-dom";
import { SearchProvider } from "./contexts/SearchContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import LendItem from "./pages/LendItem";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ItemDetail from "./pages/ItemDetail";


function App() {
  const location = useLocation();
  
  // Pages where we DON'T want the sidebar (like Login/Register)
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
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
              <Route path="/items/:id" element={<ItemDetail />} />
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}

export default App;