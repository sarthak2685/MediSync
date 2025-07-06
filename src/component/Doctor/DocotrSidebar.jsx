import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiUser, FiFileText, FiBell, FiClock, FiClipboard } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa";

const links = [
  { name: "Dashboard", path: "/doctor/dashboard", icon: <FiUser /> },
  { name: "Profile", path: "/doctor/profile", icon: <FiUser /> },
  { name: "Schedule", path: "/doctor/schedule", icon: <FiClock /> },
  { name: "Appointments", path: "/doctor/appointments", icon: <FiCalendar /> },
  { name: "Prescriptions", path: "/doctor/prescriptions", icon: <FiFileText /> },
  { name: "History", path: "/doctor/history", icon: <FiClipboard /> },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
      window.location.reload();
    };

  return (
    <>
      {/* Overlay on small screen */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0  w-64 bg-white shadow-md border-r z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8 text-blue-600 border-b pb-4">Doctor Panel</h2>
          <nav className="space-y-3">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={toggleSidebar}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
      </aside>
    </>
  );
};

export default Sidebar;
