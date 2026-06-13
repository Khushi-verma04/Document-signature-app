import { useEffect, useState } from "react";
import PDFViewer from "./PDFViewer";

import SignDocument from "./pages/SignDocument";
import { Routes, Route, Link } from "react-router-dom"; // Fixed: Removed BrowserRouter from here
import axios from "axios";

function App() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function getDocs() {
      try {
        const res = await fetch("http://localhost:5000/api/docs/all");
        console.log("Status:", res.status);

        const data = await res.json();
        console.log("Data:", data);

        setDocuments(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }

    getDocs();
  }, []);

  console.log("Documents State:", documents);

  return (
    // Fixed: Removed <BrowserRouter> wrapping from here
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-10">
            <h1 className="text-4xl font-bold">
              Document Signature App
            </h1>

            <h2 className="mt-6 text-2xl font-semibold">
              My Documents
            </h2>

            {documents.map((doc) => (
              <div key={doc._id}>
                <p>{doc.originalName}</p>

                <Link
                  to="/viewer"
                  state={{
                    pdfUrl: `http://localhost:5000/${doc.filePath.replace(/\\/g, "/")}`,
                    fileId: doc._id,
                  }}
                >
                  Preview PDF
                </Link>
              </div>
            ))}
          </div>
        }
      />

      <Route
        path="/viewer"
        element={<PDFViewer />}
      />

      <Route path="/sign/:token" element={<SignDocument />} />

    </Routes>
  );
}

export default App;