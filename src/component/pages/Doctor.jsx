import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Config";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("doctors");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${Config.apiUrl}/admin/doctors`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const fetchSchedules = async (doctorId) => {
    try {
      setSelectedDoctor(doctorId);
      setLoading(true);
      const res = await axios.get(`${Config.apiUrl}/patient/doctor-schedule/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data || []);
      setActiveTab("schedules");
    } catch (err) {
      console.error("Error fetching schedule", err);
      setError("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (scheduleId) => {
    try {
      setLoading(true);
      await axios.post(
        `${Config.apiUrl}/patient/book-appointment`,
        { doctorId: selectedDoctor, scheduleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Appointment Booked Successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh schedules after booking
      fetchSchedules(selectedDoctor);
    } catch (err) {
      console.error("Booking failed", err);
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInitiation = (doctor) => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      alert("Please login to book an appointment.");
      navigate("/login");
    } else {
      fetchSchedules(doctor._id);
    }
  };

  const handleBackToDoctors = () => {
    setActiveTab("doctors");
    setSelectedDoctor(null);
    setSchedules([]);
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-[#f0f4ff] to-[#eafff3] py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-[#f0f4ff] to-[#eafff3] py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-4 bg-[#2C7BE5] text-white px-4 py-2 rounded-md hover:bg-[#1a5fd1] transition-all"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-[#f0f4ff] to-[#eafff3] py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        {activeTab === "doctors" ? (
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
              Our Top Specialists
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
              Trusted by thousands, our doctors bring compassionate care & expertise.
            </p>

            {doctors.length === 0 ? (
              <p>No doctors available at the moment.</p>
            ) : (
              <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {doctors.map((doctor, index) => (
                  <div
                    key={doctor._id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.2}s`, animationFillMode: "both" }}
                  >
                    <img
                      src={doctor.avatar?.url || "https://via.placeholder.com/150"}
                      alt={doctor.name}
                      className="w-28 h-28 rounded-full mx-auto object-cover mb-4 border-4 border-[#2C7BE5]"
                    />
                    <h3 className="text-xl font-semibold text-[#2C7BE5]">{doctor.name}</h3>
                    <p className="text-[#00B894] font-medium">
                      {doctor.specialization?.join(", ") || "General Practitioner"}
                    </p>
                    <p className="text-gray-500 font-semibold">
                      Consultation Fee: ₹{doctor.consultationFee || "NA"}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {doctor.bio || "Expert in their field"}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Experience: {doctor.experience || 0} years</p>
                    </div>

                    <button
                      onClick={() => handleBookingInitiation(doctor)}
                      className="mt-4 bg-[#2C7BE5] text-white px-4 py-2 rounded-md hover:bg-[#1a5fd1] transition-all"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={handleBackToDoctors}
              className="flex items-center text-[#2C7BE5] mb-6 hover:text-[#1a5fd1] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Doctors
            </button>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
                Available Schedules
              </h2>
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              {schedules.length === 0 ? (
                <p>No available schedules for this doctor.</p>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {new Date(schedule.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Slots available: {schedule.availableSlots}
                          </p>
                        </div>
                        <button
                          onClick={() => handleBook(schedule._id)}
                          disabled={schedule.availableSlots <= 0}
                          className={`px-4 py-2 rounded-md ${
                            schedule.availableSlots > 0
                              ? "bg-[#2C7BE5] hover:bg-[#1a5fd1] text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          } transition-all`}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;