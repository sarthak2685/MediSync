import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminReports = () => {
  const summary = {
    totalUsers: 120,
    totalAppointments: 85,
    confirmed: 50,
    pending: 25,
    cancelled: 10,
  };
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50 flex">
    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    <div className="flex-1  flex flex-col">
    <Header onToggleSidebar={toggleSidebar} />
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-semibold text-blue-600">{summary.totalUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="text-gray-500 text-sm">Appointments</h3>
          <p className="text-3xl font-semibold text-blue-600">{summary.totalAppointments}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="text-gray-500 text-sm">Confirmed Appointments</h3>
          <p className="text-3xl font-semibold text-green-600">{summary.confirmed}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="text-gray-500 text-sm">Pending Appointments</h3>
          <p className="text-3xl font-semibold text-yellow-500">{summary.pending}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h3 className="text-gray-500 text-sm">Cancelled Appointments</h3>
          <p className="text-3xl font-semibold text-red-500">{summary.cancelled}</p>
        </div>
      </div>

      {/* Placeholder for future chart */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Appointment Chart (Coming Soon)</h4>
        <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AdminReports;
