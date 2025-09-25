import React from "react";
import { LayoutDashboard, PlusSquare, HelpCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove authentication token
    navigate("/logout"); // Navigate to Logout page
  };

  return (
    <aside
      className={`bg-white shadow-md ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 flex flex-col sticky top-16 h-[calc(100vh-4rem)]`}
    >
      {/* Centering Navigation Menu */}
      <nav className="flex flex-col items-start justify-center flex-1 space-y-4 px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 text-gray-700 hover:text-black transition"
        >
          <LayoutDashboard className="w-5 h-5" /> {isOpen && "Dashboard"}
        </Link>
<br />
        <Link
          to="/property"
          className="flex items-center gap-3 text-gray-700 hover:text-black transition"
        >
          <PlusSquare className="w-5 h-5" /> {isOpen && "Add Properties"}
        </Link>
        <br />

        {/* Help Center Link */}
        <Link
          to="/helpCenter"
          className="flex items-center gap-3 text-gray-700 hover:text-black transition"
        >
          <HelpCircle className="w-5 h-5" /> {isOpen && "Help Center"}
        </Link>
      </nav>

      {/* Logout Button at Bottom */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-700 hover:text-black transition w-full"
        >
          <LogOut className="w-5 h-5" /> {isOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
