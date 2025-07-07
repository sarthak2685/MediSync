import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Doctor/DocotrSidebar";
import Header from "../Doctor/DoctorHeader";
import Config from "../../Config";

const DoctorPrescriptions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    patientId: "", 
    medications: "", 
    notes: "" 
  });
  const token = localStorage.getItem("token");

  // Fetch prescriptions and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prescriptionsRes, patientsRes] = await Promise.all([
          axios.get(`${Config.apiUrl}/doctor/prescriptions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${Config.apiUrl}/admin/patients`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setPrescriptions(prescriptionsRes.data || []);
        setPatients(patientsRes.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load data");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.medications) {
      setError("Patient and medications are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${Config.apiUrl}/doctor/prescription`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Prescription added successfully");
      setForm({ patientId: "", medications: "", notes: "" });
      fetchPrescriptions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to add prescription", err);
      setError("Failed to submit prescription");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`${Config.apiUrl}/doctor/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(res.data || []);
    } catch (err) {
      console.error("Error fetching prescriptions", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Prescriptions</h2>

          {success && (
            <div className="bg-green-100 text-green-800 p-3 mb-4 rounded-md">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-md">
              {error}
            </div>
          )}

          {/* Add Prescription Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm max-w-xl space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.email || patient.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medications
              </label>
              <textarea
                name="medications"
                value={form.medications}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medications, dosage, and instructions"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or instructions"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Submitting..." : "Add Prescription"}
            </button>
          </form>

          {/* Prescription List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Prescriptions
            </h3>

            {loading && prescriptions.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border rounded p-4 shadow-sm h-24 animate-pulse"></div>
                ))}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="bg-white border rounded p-8 text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="mt-2 text-lg font-medium text-gray-900">
                  No prescriptions yet
                </h4>
                <p className="mt-1 text-gray-500">
                  Create your first prescription using the form above
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {prescriptions.map((p) => (
                  <li
                    key={p._id}
                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {p.patient?.name || "Unknown Patient"}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(p.createdAt)}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Prescription
                      </span>
                    </div>

                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">
                        Medications:
                      </h5>
                      <p className="text-gray-600 whitespace-pre-line">
                        {p.medications}
                      </p>
                    </div>

                    {p.notes && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium text-gray-700">
                          Doctor's Notes:
                        </h5>
                        <p className="text-gray-600 whitespace-pre-line">
                          {p.notes}
                        </p>
                      </div>
                    )}
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

export default DoctorPrescriptions;