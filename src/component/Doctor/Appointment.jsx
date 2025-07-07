import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Doctor/DocotrSidebar";
import Header from "../Doctor/DoctorHeader";
import Config from "../../Config";

const DoctorAppointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${Config.apiUrl}/doctor/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.post(
        `${Config.apiUrl}/doctor/appointment-status`,
        { appointmentId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Could not update status");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Appointments</h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="bg-white p-5 border rounded-lg shadow-sm space-y-2"
                >
                  <p className="text-gray-700">
                    <strong>Patient:</strong> {apt.patient?.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Date:</strong>{" "}
                    {new Date(apt.schedule?.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Time:</strong> {apt.schedule?.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        apt.status === "confirmed"
                          ? "text-green-600"
                          : apt.status === "cancelled"
                          ? "text-red-500"
                          : apt.status === "completed"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </p>

                  <div className="flex gap-2 mt-3">
                    {["confirmed", "cancelled", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(apt._id, status)}
                        className={`px-3 py-1 text-sm rounded border transition ${
                          apt.status === status
                            ? "bg-gray-200"
                            : "hover:bg-blue-100"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorAppointments;
