// components/patient/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaFileMedical, FaFileUpload, FaSignOutAlt } from "react-icons/fa";

const links = [
  { name: "Profile", path: "/patient/profile", icon: <FaUser /> },
  { name: "Book Appointment", path: "/patient/book-appointment", icon: <FaCalendarAlt /> },
  { name: "My Appointments", path: "/patient/appointment", icon: <FaCalendarAlt /> },
  { name: "Prescriptions", path: "/patient/prescriptions", icon: <FaFileMedical /> },
  { name: "Documents", path: "/patient/documents", icon: <FaFileUpload /> },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r transition-transform z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="p-6 border-b flex justify-between items-center md:justify-center">
        <h2 className="text-xl font-bold text-blue-600">Patient Panel</h2>
        <button className="md:hidden text-gray-600" onClick={toggleSidebar}>✖</button>
      </div>
      <nav className="flex flex-col p-4 gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
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
  );
};

export default Sidebar;
