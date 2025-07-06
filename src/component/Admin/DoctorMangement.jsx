import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import config from "../../Config";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (doctorId, isApproved) => {
    try {
      await axios.put(
        `${config.apiUrl}/admin/approve-doctor`,
        { doctorId, isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDoctors();
      setShowModal(false);
    } catch (error) {
      console.error("Approval Error", error);
    }
  };

  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  if (loading) return <div className="p-6">Loading doctors...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Doctor Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border rounded shadow-sm text-sm">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr 
                    key={doctor._id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => openDoctorModal(doctor)}
                  >
                    <td className="py-3 px-4">{doctor.name}</td>
                    <td className="py-3 px-4">{doctor.email}</td>
                    <td className="py-3 px-4">
                      {doctor.isApproved ? (
                        <span className="text-green-600 font-medium">Approved</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      {!doctor.isApproved && (
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(doctor._id, true);
                          }}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-100 rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Doctor Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {selectedDoctor.avatar?.url ? (
                  <img 
                    src={selectedDoctor.avatar.url} 
                    alt="Doctor Avatar"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <DetailItem label="Name" value={selectedDoctor.name} />
                <DetailItem label="Email" value={selectedDoctor.email} />
                <DetailItem label="Phone" value={selectedDoctor.phone} />
                <DetailItem label="Gender" value={selectedDoctor.gender} />
                <DetailItem label="Date of Birth" value={new Date(selectedDoctor.dob).toLocaleDateString()} />
                <DetailItem label="Experience" value={`${selectedDoctor.experience} years`} />
                <DetailItem label="Consultation Fee" value={`₹${selectedDoctor.consultationFee}`} />
                <DetailItem label="Specializations" value={selectedDoctor.specialization?.join(", ")} />
                
                <div className="md:col-span-2">
                  <DetailItem label="Bio" value={selectedDoctor.bio} />
                </div>

                {selectedDoctor.qualifications?.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Qualifications:</h4>
                    <ul className="space-y-2">
                      {selectedDoctor.qualifications.map((qual, index) => (
                        <li key={index} className="pl-4 border-l-2 border-gray-200">
                          <p><span className="font-medium">{qual.degree}</span> from {qual.institute} ({qual.year}) </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {!selectedDoctor.isApproved && (
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => handleApprove(selectedDoctor._id, false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedDoctor._id, true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// Helper component for detail items
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

export default DoctorManagement;