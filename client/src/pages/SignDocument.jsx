import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

// नया लोकल नोड मॉड्यूल वर्कर पाथ जो एरर को ठीक करेगा
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function SignDocument() {
  const { token } = useParams();

  const [doc, setDoc] = useState(null);
  const [signer, setSigner] = useState("");
  const [selectedFont, setSelectedFont] = useState("cursive");

  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/signatures/sign/${token}`
        );
        setDoc({
          filePath: res.data.filePath,
          originalName: res.data.originalName,
          fileId: res.data.fileId
        });
      } catch (err) {
        console.log("API ERROR:", err);
      }
    };
    fetchDoc();
  }, [token]);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    const boundingBox = e.currentTarget.getBoundingClientRect();
    setRel({
      x: e.clientX - boundingBox.left,
      y: e.clientY - boundingBox.top,
    });
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const containerBox = containerRef.current.getBoundingClientRect();
    let x = e.clientX - containerBox.left - rel.x;
    let y = e.clientY - containerBox.top - rel.y;
    setPosition({ x, y });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!signer) {
      alert("कृपया हस्ताक्षर करने के लिए अपना नाम दर्ज करें!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/signatures", {
        fileId: doc?.fileId,
        signer: signer,
        fontFamily: selectedFont,
        x: position.x,
        y: position.y
      });

      alert("डॉक्यूमेंट सफलतापूर्वक साइन हो गया है!");
      const pdfUrl = `http://localhost:5000/${res.data.signedPdfPath.replace(/\\/g, "/")}`;
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.log(err);
      alert("सिग्नेचर सेव करने में एरर आया!");
    }
  };

  const getFontClass = (font) => {
    if (font === "cursive") return "font-serif italic";
    if (font === "serif") return "font-serif italic";
    if (font === "monospace") return "font-mono";
    return "font-sans font-bold";
  };

  if (!doc?.filePath) return <h2 className="text-center mt-10 text-xl font-semibold">Loading Document...</h2>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-8 justify-center items-start">
      
      <div className="w-full md:w-96 bg-white p-6 rounded-xl shadow border border-gray-200 sticky top-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sign Document</h2>
        <p className="text-sm text-gray-500 mb-6">File: <span className="font-semibold text-gray-700">{doc.originalName}</span></p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Full Name</label>
          <input
            placeholder="Type your name to sign"
            value={signer}
            onChange={(e) => setSigner(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Signature Style</h3>
        <div className="space-y-3 mb-6">
          <div
            onClick={() => setSelectedFont("cursive")}
            className={`p-3 rounded-lg border text-xl cursor-pointer ${selectedFont === "cursive" ? "border-2 border-orange-500 bg-orange-50/40" : "border-gray-200"}`}
            style={{ fontFamily: "'Segoe Script', cursive", fontStyle: "italic" }}
          >
            {signer || "Signature Style 1"}
          </div>

          <div
            onClick={() => setSelectedFont("serif")}
            className={`p-3 rounded-lg border text-2xl cursor-pointer ${selectedFont === "serif" ? "border-2 border-orange-500 bg-orange-50/40" : "border-gray-200"}`}
            style={{ fontFamily: "Times New Roman, serif", fontStyle: "italic" }}
          >
            {signer || "Signature Style 2"}
          </div>

          <div
            onClick={() => setSelectedFont("monospace")}
            className={`p-3 rounded-lg border text-xl cursor-pointer ${selectedFont === "monospace" ? "border-2 border-orange-500 bg-orange-50/40" : "border-gray-200"}`}
            style={{ fontFamily: "Courier New, monospace" }}
          >
            {signer || "Signature Style 3"}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition-all"
        >
          Sign & Submit Document
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <p className="text-sm text-gray-400 mb-2">सिग्नेचर को खींचकर (Drag) PDF में सही जगह पर सेट करें</p>
        
        <div 
          ref={containerRef}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="relative bg-white shadow-lg border border-gray-300"
          style={{ width: "max-content" }}
        >
          <Document
            file={`http://localhost:5000/${doc.filePath.replace(/\\/g, "/")}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>

          <div
            onMouseDown={onMouseDown}
            className={`absolute p-2 border-2 border-dashed border-blue-500 bg-blue-500/10 cursor-move select-none text-2xl text-blue-800 ${getFontClass(selectedFont)}`}
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
            }}
          >
            {signer || "Signature"}
          </div>
        </div>
      </div>

    </div>
  );
}

export default SignDocument;