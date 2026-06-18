import { useEffect, useState } from "react";
import PDFViewer from "./PDFViewer";

import SignDocument from "./pages/SignDocument";
import Dashboard from "./pages/Dashboard"; 
import RoleSelection from "./pages/RoleSelection";
import SignatureDetails from "./pages/SignatureDetails";

import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  // 1. Fetch all uploaded documents from database
  const getDocs = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/docs/all`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    getDocs();
  }, []);

  // 2. File upload logic
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setUploading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/docs/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      setFile(null);
      await getDocs(); 

      // Redirect straight to Role Selection page after upload
      navigate("/role-selection", {
        state: {
          pdfUrl: `${BACKEND_URL}/${res.data.document.filePath.replace(/\\/g, "/")}`,
          fileId: res.data.document._id,
        },
      });

    } catch (error) {
      console.error("Upload Error:", error);
      alert(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // 3. Delete Document Logic
  const handleDeleteDoc = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/docs/${id}`);
      alert("Document deleted successfully!");
      await getDocs(); 
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete document");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6 md:p-12 font-sans selection:bg-orange-500/20">
            <div className="max-w-4xl mx-auto">
              
              {/* Header section */}
              <div className="text-center md:text-left mb-8">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full mb-3 tracking-wide uppercase">
                  ⚡ v1.0 Live Pro
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">
                  Document <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Signature</span> App
                </h1>
                <p className="text-slate-500 font-medium max-w-md">
                  Securely upload, sign, and manage your PDF contracts smoothly.
                </p>
              </div>

              {/* 🛠️ Fixed: Compact & Beautiful File Upload Box */}
              <div className="bg-white p-5 rounded-2xl shadow-lg shadow-slate-100 border border-slate-200/60 mb-10 transition-all duration-300 hover:shadow-xl max-w-2xl mx-auto md:mx-0">
                <input
                  type="file"
                  accept=".pdf"
                  id="pdf-upload-input"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])} // Gets only the first file
                />
                <label
                  htmlFor="pdf-upload-input"
                  className="cursor-pointer block border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/30 hover:bg-orange-50/10 rounded-xl p-6 transition-all group text-center"
                >
                  <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-all duration-300 text-2xl">
                    📁
                  </div>
                  <span className="text-slate-700 font-bold text-base block group-hover:text-orange-500 transition-colors">
                    {file ? file.name : "Choose PDF file from computer"}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Only clean .pdf format files are supported
                  </span>
                </label>

                {file && (
                  <button
                    onClick={handleFileUpload}
                    disabled={uploading}
                    className="mt-4 w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold text-base rounded-xl shadow-md shadow-orange-500/10 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {uploading ? "Uploading document safely..." : "Proceed to Sign (Upload PDF)"}
                  </button>
                )}
              </div>

              {/* Document List Grid Layout */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">My Documents</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold text-slate-500 bg-slate-200 rounded-md">
                  {documents.length} Files
                </span>
              </div>

              <div className="grid gap-4">
                {documents.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                    <p className="text-slate-400 font-medium italic">No active documents on server.</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div 
                      key={doc._id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3.5 mb-4 sm:mb-0">
                        <div className="w-10 h-10 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                          PDF
                        </div>
                        <div className="truncate max-w-[280px] md:max-w-md">
                          <p className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition-colors truncate">
                            {doc.originalName}
                          </p>
                          <span className="text-xs font-mono font-medium text-slate-400 block mt-0.5">
                            ID: {doc._id.substring(0, 12)}...
                          </span>
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="flex items-center gap-3 justify-end sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <button
                          onClick={() => navigate("/role-selection", {
                            state: {
                              pdfUrl: `${BACKEND_URL}/${doc.filePath.replace(/\\/g, "/")}`,
                              fileId: doc._id,
                            }
                          })}
                          className="px-4 py-2 bg-slate-100 hover:bg-orange-500 text-slate-700 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm shadow-slate-100"
                        >
                          Preview PDF
                        </button>

                        <button
                          onClick={(e) => handleDeleteDoc(doc._id, e)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all cursor-pointer"
                          title="Delete File"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        }
      />

      <Route path="/viewer" element={<PDFViewer />} />
      <Route path="/sign/:token" element={<SignDocument />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/signature-details" element={<SignatureDetails />} />
    </Routes>
  );
}

export default App;