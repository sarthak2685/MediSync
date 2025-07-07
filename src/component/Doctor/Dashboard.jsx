import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Doctor/DocotrSidebar";
import Header from "../Doctor/DoctorHeader";
import config from "../../Config";
const DoctorDashboard = () => {
  const [profile, setProfile] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"))

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appointmentsRes] = await Promise.all([
          axios.get(`${config.apiUrl}/doctor/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${config.apiUrl}/doctor/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(profileRes.data.doctor || {});
        setAppointments(appointmentsRes.data.appointments || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAppointmentStats = () => {
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;

    return { total, confirmed, pending, cancelled };
  };

  const stats = getAppointmentStats();

  if (loading) return <div className="text-center text-gray-600">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Welcome, Dr. {user.name || "guest"}</h2>
          

          {/* Appointment Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Appointments" value={stats.total} color="blue" />
            <StatCard label="Confirmed" value={stats.confirmed} color="green" />
            <StatCard label="Pending" value={stats.pending} color="yellow" />
            <StatCard label="Cancelled" value={stats.cancelled} color="red" />
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-500",
    red: "text-red-500",
  };

  return (
    <div className="bg-white border rounded-md p-5 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">{label}</p>
      <h4 className={`text-3xl font-bold ${colorMap[color]}`}>{value}</h4>
    </div>
  );
};

export default DoctorDashboard;
