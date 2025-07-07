import React, { useEffect, useState } from "react";
import Sidebar from "../patient/PatientSidebar";
import Header from "../patient/PatientHeader";
import axios from "axios";
import Config from "../../Config";

const Documents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await axios.get(`${Config.apiUrl}/patient/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDocuments(res.data || []);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentName", file.name); // Add document name
  
    try {
      await axios.post(`${Config.apiUrl}/patient/upload-document`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 md:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Documents</h2>

          <form onSubmit={uploadFile} className="mb-6 flex items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded"
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Upload
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc._id} className="p-4 bg-white shadow rounded border">
                <p className="text-sm text-gray-600">{doc.name}</p>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm"
                >
                  View Document
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;
