import React, { useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Property from "./pages/Property";
import HelpCenter from "./pages/HelpCenter";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Logout from "./pages/Logout";
import NotificationPage from "./pages/NotificationPage";
import ForgotPassword from "./pages/ForgetPassword";

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgotpassword";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Header (Only if NOT on login/register pages) */}
      {!isAuthPage && <Header toggleSidebar={toggleSidebar} />}

      <div className={`h-screen ${isAuthPage ? "flex justify-center items-center" : "grid grid-cols-[250px_1fr]"}`}>
        {/* Sidebar (Only if NOT on login/register pages) */}
        {!isAuthPage && <Sidebar isOpen={isSidebarOpen} />}

        {/* Main Content Area */}
        <div className={`overflow-y-auto ${isAuthPage ? "w-full" : ""}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/helpCenter" element={<HelpCenter />} />
            <Route path="/property" element={<Property />} />
            
            <Route path="/logout" element={<Logout />} />
            <Route path="/notifications" element={<NotificationPage />} />

  

            {/* Fallback Route - Prevents white screen */}
            <Route path="*" element={<h1 className="text-center text-red-600">404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
