import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";

// @ts-ignore
import profile from "../assets/images/profile.png";
// @ts-ignore
import logo from "../assets/images/logo.png"; 
import { useNotifications } from "../context/NotificationContext";

// eslint-disable-next-line react/prop-types
const Header = ({ toggleSidebar }) => {
  const { notifications } = useNotifications(); // Get notifications

  return (
    <header className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50 flex items-center justify-between" style={{ height: "80px" }}>
      <button onClick={toggleSidebar} className="sm:hidden">
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-22 h-20" />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Link to="/notifications">
            <Bell className="text-gray-600 w-6 h-6 transition hover:text-gray-900" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
            )}
          </Link>
        </div>

        <div className="relative">
          <img src={profile} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
