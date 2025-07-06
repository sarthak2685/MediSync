// components/patient/Header.jsx
import React from "react";
import { FaBars, FaBell } from "react-icons/fa";

const Header = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40 px-4 py-3 flex justify-between items-center">
      {/* Hamburger on small screens */}
      <button className="md:hidden text-gray-600 text-xl" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      <h1 className="text-xl font-semibold text-blue-600 hidden md:block">Patient Dashboard</h1>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 relative">
          <FaBell />
          {/* Optional: Red dot */}
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full text-xs"></span>
        </button>
        {/* <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
        /> */}
    <div className="flex items-center gap-3">
  <span className="text-gray-700 text-sm">{user.name}</span>
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
      </div>
    </header>
  );
};

export default Header;
