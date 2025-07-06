import React from "react";
import { FiBell, FiMenu } from "react-icons/fi";

const Header = ({ onToggleSidebar }) => {

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50 border-b">
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md bg-blue-50 text-blue-600 border border-blue-200"
        >
          <FiMenu size={20} />
        </button>
        <h1 className="text-lg font-bold text-blue-600">Doctor Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-blue-600">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        {user.avatar?.url ? (
                  <img 
                    src={user.avatar.url} 
                    alt="Doctor Avatar"
                    className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center"
                                        />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                )
              }
     
      </div>
    </header>
  );
};

export default Header;
