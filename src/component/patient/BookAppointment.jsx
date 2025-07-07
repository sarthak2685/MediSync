import React, { useEffect, useState } from "react";
import Sidebar from "../patient/PatientSidebar";
import Header from "../patient/PatientHeader";
import axios from "axios";
import config from "../../Config";

const BookAppointment = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("doctors"); // 'doctors' or 'schedules'

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/patient/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const res = await axios.get(`${config.apiUrl}/patient/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorDetails(res.data);
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching doctor details", err);
    }
  };

  const fetchSchedules = async (doctorId) => {
    try {
      setSelectedDoctor(doctorId);
      setLoading(true);
      const res = await axios.get(`${config.apiUrl}/patient/doctor-schedule/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data || []);
      setActiveTab("schedules");
    } catch (err) {
      console.error("Error fetching schedule", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (scheduleId) => {
    try {
      setLoading(true);
      await axios.post(
        `${config.apiUrl}/patient/book-appointment`,
        { doctorId: selectedDoctor, scheduleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Appointment Booked Successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh schedules after booking
      fetchSchedules(selectedDoctor);
    } catch (err) {
      console.error("Booking failed", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

          {success && (
            <div className="bg-green-100 text-green-800 px-4 py-3 mb-6 rounded-md">
              {success}
            </div>
          )}

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("doctors")}
              className={`px-4 py-2 rounded-md ${activeTab === "doctors" ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Available Doctors
            </button>
            {selectedDoctor && (
              <button
                onClick={() => setActiveTab("schedules")}
                className={`px-4 py-2 rounded-md ${activeTab === "schedules" ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Available Schedules
              </button>
            )}
          </div>

          {activeTab === "doctors" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="border p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    {doc.avatar?.url ? (
                      <img
                        src={doc.avatar.url}
                        alt={doc.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {doc.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-blue-700">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.specialization?.join(", ")}</p>
                      <p className="text-sm text-gray-500">{doc.experience} years experience</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-medium">Consultation Fee:</span> ₹{doc.consultationFee}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Qualifications:</span>{" "}
                      {doc.qualifications?.map(q => `${q.degree} (${q.institute})`).join(", ")}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchDoctorDetails(doc._id)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => fetchSchedules(doc._id)}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "schedules" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              {doctorDetails && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center space-x-4 mb-4">
                    {doctorDetails.avatar?.url ? (
                      <img
                        src={doctorDetails.avatar.url}
                        alt={doctorDetails.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {doctorDetails.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{doctorDetails.name}</h3>
                      <p className="text-sm text-gray-600">
                        {doctorDetails.specialization?.join(", ")} • ₹{doctorDetails.consultationFee} consultation fee
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
              
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map((sch) => (
                    <div
                      key={sch._id}
                      className="border p-4 rounded flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{formatDate(sch.date)}</p>
                        <p className="text-sm text-gray-600">{sch.startTime} - {sch.endTime}</p>
                      </div>
                      <button
                        onClick={() => handleBook(sch._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {loading ? "Booking..." : "Book Now"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No available schedules found for this doctor.</p>
              )}
            </div>
          )}

          {/* Doctor Details Modal */}
          {showDetails && doctorDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">Doctor Details</h3>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      {doctorDetails.avatar?.url ? (
                        <img
                          src={doctorDetails.avatar.url}
                          alt={doctorDetails.name}
                          className="w-32 h-32 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500 mx-auto">
                          {doctorDetails.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">{doctorDetails.name}</h3>
                      <p className="text-lg text-blue-600 mb-4">
                        {doctorDetails.specialization?.join(", ")}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-700">Personal Information</h4>
                          <ul className="mt-2 space-y-1">
                            <li><span className="text-gray-600">Gender:</span> {doctorDetails.gender}</li>
                            <li><span className="text-gray-600">Age:</span> {calculateAge(doctorDetails.dob)} years</li>
                            <li><span className="text-gray-600">Phone:</span> {doctorDetails.phone}</li>
                            <li><span className="text-gray-600">Email:</span> {doctorDetails.email}</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Professional Information</h4>
                          <ul className="mt-2 space-y-1">
                            <li><span className="text-gray-600">Experience:</span> {doctorDetails.experience} years</li>
                            <li><span className="text-gray-600">Consultation Fee:</span> ₹{doctorDetails.consultationFee}</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700">Qualifications</h4>
                        <div className="mt-2 space-y-2">
                          {doctorDetails.qualifications?.map((qual, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                              <p className="font-medium">{qual.degree}</p>
                              <p className="text-sm">{qual.institute} ({qual.year})</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">About</h4>
                        <p className="mt-2 text-gray-600">{doctorDetails.bio || "No bio available"}</p>
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
                    <button
                      onClick={() => {
                        setShowDetails(false);
                        fetchSchedules(doctorDetails._id);
                        setActiveTab("schedules");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Book Appointment
                    </button>
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

export default BookAppointment;