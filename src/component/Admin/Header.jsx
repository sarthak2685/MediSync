import React from "react";
import { FiMenu } from "react-icons/fi";

const Header = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-gray-200">
      <div className="flex items-center gap-4">
        {/* Hamburger only on mobile */}
        <button
          className="md:hidden text-gray-600"
          onClick={onToggleSidebar}
        >
          <FiMenu size={22} />
        </button>
        <h1 className="text-xl font-semibold text-blue-600">Admin Panel</h1>
      </div>
      <div className="flex items-center gap-3">
  <span className="text-gray-700 text-sm">{user.name}</span>
  <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center">
    <span className="text-blue-600 font-medium text-sm">
      {user.name.charAt(0).toUpperCase()}
    </span>
  </div>
</div>
    </header>
  );
};

export default Header;
