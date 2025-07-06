import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiX } from "react-icons/fi";

const links = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Appointments", path: "/admin/appointments" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Doctors", path: "/admin/doctors" },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0  w-64 bg-gray-100 border-r border-gray-300 p-6 flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
    >
        <div className="md:hidden absolute top-4 right-4">
        <button onClick={toggleSidebar} className="text-gray-600">
          <FiX size={22} />
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">
          Hospital Admin
        </h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={toggleSidebar} // Close sidebar on mobile click
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 text-sm text-gray-700 border border-gray-300 hover:bg-gray-200 transition-all py-2 px-4 rounded-md"
      >
        <FiLogOut size={16} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
