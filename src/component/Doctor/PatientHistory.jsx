import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Doctor/DocotrSidebar";
import Header from "../Doctor/DoctorHeader";
import Config from "../../Config";

const PatientHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    if (!patientId) return alert("Please enter a Patient ID");

    setLoading(true);
    try {
      const res = await axios.get(`${Config.apiUrl}/doctor/history/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history);
    } catch (err) {
      console.error("Failed to fetch history", err);
      alert("Patient history not found or error occurred.");
      setHistory(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Patient History</h2>

          {/* Search Form */}
          <div className="bg-white p-4 border rounded shadow-sm mb-6 max-w-md">
            <label className="block text-sm text-gray-600 mb-2">Enter Patient ID</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-3"
              placeholder="e.g., 654abc..."
            />
            <button
              onClick={fetchHistory}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Fetching..." : "Fetch History"}
            </button>
          </div>

          {/* History Display */}
          {history && (
            <div className="space-y-6">
              {/* Prescriptions */}
              <div className="bg-white p-5 rounded border shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Prescriptions</h3>
                {history.prescriptions?.length === 0 ? (
                  <p className="text-gray-500">No prescriptions found.</p>
                ) : (
                  <ul className="space-y-3">
                    {history.prescriptions.map((p) => (
                      <li key={p._id} className="border rounded p-3">
                        <p><strong>Medications:</strong> {p.medications}</p>
                        <p><strong>Notes:</strong> {p.notes || "N/A"}</p>
                        <p className="text-sm text-gray-500">
                          <strong>Date:</strong>{" "}
                          {new Date(p.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Appointments */}
              <div className="bg-white p-5 rounded border shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Appointments</h3>
                {history.appointments?.length === 0 ? (
                  <p className="text-gray-500">No appointments found.</p>
                ) : (
                  <ul className="space-y-3">
                    {history.appointments.map((a) => (
                      <li key={a._id} className="border rounded p-3">
                        <p><strong>Status:</strong> {a.status}</p>
                        <p><strong>Time:</strong> {a.schedule?.time}</p>
                        <p><strong>Date:</strong> {new Date(a.schedule?.date).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientHistory;
