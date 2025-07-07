import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Doctor/DocotrSidebar";
import Header from "../Doctor/DoctorHeader";
import config from "../../Config";


const DoctorSchedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [date, setdate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState(30);
  const [schedules, setSchedules] = useState([]);
  // Fetch all schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/doctor/schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSchedule = async () => {
    if (!date || !startTime || !endTime) return alert("Please fill all fields");
  
    try {
      await axios.post(
        `${config.apiUrl}/doctor/add-schedule`,
        { date, startTime, endTime, slotDuration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Reset form
      setdate("");
      setStartTime("");
      setEndTime("");
      fetchSchedules();
    } catch (err) {
      console.error("Add schedule failed", err);
      alert("Failed to add schedule");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/doctor/schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSchedules();
      alert("Schedule deleted");
    } catch (err) {
      console.error("Delete schedule failed", err);
      alert("Failed to delete schedule");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Manage Schedules</h2>

          <div className="bg-white border rounded-lg p-6 shadow-sm max-w-xl space-y-4">
  <div>
    <label className="block text-sm text-gray-600 mb-1">date</label>
    <input
      type="date"
      value={date}
      onChange={(e) => setdate(e.target.value)}
      className="w-full border rounded-md px-4 py-2"
    />
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm text-gray-600 mb-1">Start Time</label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full border rounded-md px-4 py-2"
      />
    </div>
    <div>
      <label className="block text-sm text-gray-600 mb-1">End Time</label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full border rounded-md px-4 py-2"
      />
    </div>
  </div>
  <button onClick={handleAddSchedule} className="bg-blue-600 text-white px-6 py-2 rounded-md">
    Add Schedule
  </button>
</div>

          {/* Schedule List */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Schedules</h3>
            {loading ? (
              <p className="text-gray-500">Loading schedules...</p>
            ) : schedules.length === 0 ? (
              <p className="text-gray-500">No schedules added.</p>
            ) : (
              <ul className="space-y-3">
                {schedules.map((s) => (
  <li key={s._id} className="bg-white border p-4 rounded-lg flex justify-between items-center">
    <div>
      <p className="text-gray-700">
        📅 {s.date} &nbsp; ⏰ {s.startTime} - {s.endTime}
      </p>
    </div>
    <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline text-sm">
      Delete
    </button>
  </li>
))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorSchedule;
