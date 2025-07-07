import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Doctor/DocotrSidebar";
import Header from "../Doctor/DoctorHeader";
import config from "../../Config";

const DoctorProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    bio: "",
    experience: "",
    consultationFee: "",
    specialization: [],
    qualifications: []
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/doctor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data || {});
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleQualificationChange = (index, field, value) => {
    const updatedQualifications = [...profile.qualifications];
    updatedQualifications[index][field] = value;
    setProfile({ ...profile, qualifications: updatedQualifications });
  };

  const addQualification = () => {
    setProfile({
      ...profile,
      qualifications: [...profile.qualifications, { degree: "", institute: "", year: "" }]
    });
  };

  const removeQualification = (index) => {
    const updatedQualifications = [...profile.qualifications];
    updatedQualifications.splice(index, 1);
    setProfile({ ...profile, qualifications: updatedQualifications });
  };

  const handleSpecializationChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setProfile({ ...profile, specialization: options });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await axios.put(`${config.apiUrl}/doctor/update-profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-10 text-gray-500">Loading profile...</div>;

  const specializationOptions = [
    "Cardiology", "Dermatology", "Neurology", "Pediatrics", 
    "Orthopedics", "Gynecology", "General Medicine", "Psychiatry",
    "Dentistry", "Ophthalmology", "ENT", "Urology"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">Doctor Profile</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-shrink-0 flex flex-col items-center">
                {profile.avatar?.url ? (
                  <img 
                    src={profile.avatar.url} 
                    alt="Doctor Avatar"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                {editMode && (
                  <button className="text-blue-600 text-sm">Change Photo</button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  {editMode ? (
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      type="text"
                    />
                  ) : (
                    <p className="font-medium">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <p className="font-medium">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  {editMode ? (
                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      type="text"
                    />
                  ) : (
                    <p className="font-medium">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium">{profile.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                  {editMode ? (
                    <input
                      name="dob"
                      value={profile.dob?.split('T')[0] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      type="date"
                    />
                  ) : (
                    <p className="font-medium">
                      {profile.dob ? new Date(profile.dob).toLocaleDateString() : "—"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Experience (years)</label>
                  {editMode ? (
                    <input
                      name="experience"
                      value={profile.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      type="number"
                      min="0"
                    />
                  ) : (
                    <p className="font-medium">{profile.experience || "—"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Consultation Fee (₹)</label>
                  {editMode ? (
                    <input
                      name="consultationFee"
                      value={profile.consultationFee}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      type="number"
                      min="0"
                    />
                  ) : (
                    <p className="font-medium">
                      {profile.consultationFee ? `₹${profile.consultationFee}` : "—"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Specializations</label>
                  {editMode ? (
                    <select
                      multiple
                      value={profile.specialization || []}
                      onChange={handleSpecializationChange}
                      className="w-full px-4 py-2 border rounded-md h-auto min-h-[42px]"
                    >
                      {specializationOptions.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">
                      {profile.specialization?.join(", ") || "—"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Bio</label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      rows="3"
                    />
                  ) : (
                    <p className="font-medium whitespace-pre-line">
                      {profile.bio || "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Qualifications</h3>
              {profile.qualifications?.length > 0 ? (
                <div className="space-y-4">
                  {profile.qualifications.map((qual, index) => (
                    <div key={index} className="border rounded p-4">
                      {editMode ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Degree</label>
                            <input
                              value={qual.degree}
                              onChange={(e) => handleQualificationChange(index, "degree", e.target.value)}
                              className="w-full px-4 py-2 border rounded-md"
                              type="text"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Institute</label>
                            <input
                              value={qual.institute}
                              onChange={(e) => handleQualificationChange(index, "institute", e.target.value)}
                              className="w-full px-4 py-2 border rounded-md"
                              type="text"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-grow">
                              <label className="block text-sm text-gray-600 mb-1">Year</label>
                              <input
                                value={qual.year}
                                onChange={(e) => handleQualificationChange(index, "year", e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                                type="number"
                              />
                            </div>
                            <button
                              onClick={() => removeQualification(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pl-4 border-l-2 border-gray-200">
                          <p>
                            <span className="font-medium">{qual.degree}</span> from {qual.institute} ({qual.year})
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No qualifications added</p>
              )}

              {editMode && (
                <button
                  onClick={addQualification}
                  className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="mr-1">+</span> Add Qualification
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfile;