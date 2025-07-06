import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import config from "../../Config";

const DoctorNotifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/doctor/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
      alert("Failed to load notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Notifications</h2>

          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications to display.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <p className="font-semibold text-gray-800">
                    {notification.title || "New Notification"}
                  </p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorNotifications;
