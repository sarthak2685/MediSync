import React, { useEffect, useState } from "react";
import Sidebar from "../patient/PatientSidebar";
import Header from "../patient/PatientHeader";
import axios from "axios";
import Config from "../../Config";

const MyAppointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Config.apiUrl}/patient/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
      setError("Failed to load appointments");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancelLoadingId(appointmentId);
      await axios.delete(`${Config.apiUrl}/patient/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== appointmentId)
      );
      setSuccess("Appointment cancelled successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to cancel", err);
      setError("Failed to cancel appointment");
      setTimeout(() => setError(""), 3000);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
          </div>

          {success && (
            <div className="bg-green-100 text-green-800 px-4 py-3 mb-6 rounded-md">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 px-4 py-3 mb-6 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments</h3>
              <p className="mt-1 text-gray-500">
                You don't have any upcoming appointments. Book one now!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {appt.doctor?.avatar?.url ? (
                            <img
                              src={appt.doctor.avatar.url}
                              alt={appt.doctor.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {appt.doctor?.name?.charAt(0) || 'D'}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {appt.doctor?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appt.doctor?.specialization?.join(", ")}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appt.status)}`}>
                              {appt.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(appt.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setShowDetails(true);
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => cancelAppointment(appt._id)}
                          disabled={cancelLoadingId === appt._id}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-red-300"
                        >
                          {cancelLoadingId === appt._id ? "Cancelling..." : "Cancel"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Appointment Details Modal */}
          {showDetails && selectedAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">Appointment Details</h3>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      {selectedAppointment.doctor?.avatar?.url ? (
                        <img
                          src={selectedAppointment.doctor.avatar.url}
                          alt={selectedAppointment.doctor.name}
                          className="w-32 h-32 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500 mx-auto">
                          {selectedAppointment.doctor?.name?.charAt(0) || 'D'}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">
                        Dr. {selectedAppointment.doctor?.name}
                      </h3>
                      <p className="text-lg text-blue-600 mb-4">
                        {selectedAppointment.doctor?.specialization?.join(", ")}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-700">Appointment Info</h4>
                          <ul className="mt-2 space-y-2">
                            <li>
                              <span className="text-gray-600">Date:</span>{" "}
                              {formatDate(selectedAppointment.date)}
                            </li>
                            <li>
                              <span className="text-gray-600">Time:</span>{" "}
                              {selectedAppointment.time}
                            </li>
                            <li>
                              <span className="text-gray-600">Status:</span>{" "}
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                                {selectedAppointment.status}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Doctor Contact</h4>
                          <ul className="mt-2 space-y-2">
                            <li>
                              <span className="text-gray-600">Email:</span>{" "}
                              {selectedAppointment.doctor?.email}
                            </li>
                            <li>
                              <span className="text-gray-600">Phone:</span>{" "}
                              {selectedAppointment.doctor?.phone}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700">Notes</h4>
                        <p className="mt-2 text-gray-600">
                          {selectedAppointment.notes || "No additional notes provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Close
                    </button>
                    {selectedAppointment.status === 'pending' && (
                      <button
                        onClick={() => {
                          cancelAppointment(selectedAppointment._id);
                          setShowDetails(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAppointments;