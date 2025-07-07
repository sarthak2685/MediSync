import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import Config from "../../Config";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${Config.apiUrl}/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardData = stats
    ? [
        { title: "Total Patient", value: stats.patientCount, icon: "👥" },
        { title: "Total Doctors", value: stats.doctorCount, icon: "🩺" },
        { title: "Appointments", value: stats.appointmentCount, icon: "📅" },
        { title: "Reports Generated", value: stats.totalReports || 0, icon: "📄" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>

          {loading ? (
            <div className="text-gray-500 text-center">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cardData.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-lg shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition"
                >
                  <div className="text-4xl">{stat.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
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

export default Dashboard;
