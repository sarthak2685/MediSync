import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import Config from "../../Config";

const AdminUser = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("doctors"); // doctors | patients
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url =
        activeTab === "doctors" ? `${Config.apiUrl}/admin/doctors` : `${Config.apiUrl}/admin/patients`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {activeTab === "doctors" ? "Doctors" : "Patients"} Management
          </h2>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab("doctors")}
              className={`px-4 py-2 rounded-md border ${
                activeTab === "doctors"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              Doctors
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`px-4 py-2 rounded-md border ${
                activeTab === "patients"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              Patients
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Email</th>
                  {/* <th className="text-left px-4 py-2">Phone</th> */}
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="px-4 py-2">{user.name || "-"}</td>
                      <td className="px-4 py-2">{user.email || "-"}</td>
                      {/* <td className="px-4 py-2">{user.phone || "-"}</td> */}
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status || "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => alert("Block/Unblock logic")}
                          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => alert("Delete logic")}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
