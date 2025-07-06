import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import config from "../../Config";

const AdminAppointments = () => {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch appointments");
      setLoading(false);
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments based on search
  const filteredAppointments = appointments.filter((appt) =>
    appt.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
    appt.doctor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle appointment status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `${config.apiUrl}/admin/appointments/${appointmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <Header onToggleSidebar={toggleSidebar} />
          <div className="p-6">Loading appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <Header onToggleSidebar={toggleSidebar} />
          <div className="p-6 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Appointments</h2>

          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            className="mb-4 px-4 py-2 border rounded-md w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full border bg-white rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Patient</th>
                  <th className="text-left px-4 py-2">Doctor</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="border-t">
                    <td className="px-4 py-2">{appt.patient?.name || "N/A"}</td>
                    <td className="px-4 py-2">{appt.doctor?.name || "N/A"}</td>
                    <td className="px-4 py-2">
                      {new Date(appt.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {appt.time || "Not specified"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          appt.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {appt.status !== "Confirmed" && (
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          onClick={() => handleStatusUpdate(appt._id, "Confirmed")}
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status !== "Cancelled" && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          onClick={() => handleStatusUpdate(appt._id, "Cancelled")}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-6">
                      No appointments found.
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

export default AdminAppointments;
