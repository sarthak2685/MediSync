import React, { useEffect, useState } from "react";
import Sidebar from "../patient/PatientSidebar";
import Header from "../patient/PatientHeader";
import axios from "axios";
import config from "../../Config";
";

const Prescriptions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getPrescriptions();
  }, []);

  const getPrescriptions = async () => {
    const res = await axios.get(`${config.apiUrl}/patient/prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPrescriptions(res.data   || []);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 md:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <p className="text-gray-500">No prescriptions available.</p>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-white shadow rounded border flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-600">Doctor: {item.doctor.name}</p>
                    <p className="text-sm">Medicines: {item.medicines}</p>
                    <p className="text-xs text-gray-400">
                      Date: {new Date(item.date).toLocaleDateString()}
                    </p>
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

export default Prescriptions;
