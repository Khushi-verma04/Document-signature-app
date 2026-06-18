import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// नया लोकल नोड मॉड्यूल वर्कर पाथ जो एरर को ठीक करेगा
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PDFViewer() {
  const location = useLocation();
  const signer = location.state?.signer || "Signature";
  const selectedFont = location.state?.selectedFont || "cursive";
  
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });

  const BASE_URL = "http://localhost:5000";

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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

  const saveSignature = async () => {
    try {
      if (!location.state?.fileId) {
        alert("File ID missing! Cannot save signature.");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/signatures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: location.state?.fileId,
          signer: signer,
          fontFamily: selectedFont,
          x: position.x,
          y: position.y,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save signature");

      alert("Signature Saved Successfully!");
      const pdfUrl = `${BASE_URL}/${data.signedPdfPath.replace(/\\/g, "/")}`;
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const getFontClass = (font) => {
    if (font === "cursive") return "font-serif italic";
    if (font === "serif") return "font-serif italic";
    if (font === "monospace") return "font-mono";
    return "font-sans font-bold";
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">PDF Viewer Page</h1>

      <button 
        onClick={saveSignature} 
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow mb-6 transition-all"
      >
        Save Signature
      </button>

      <div 
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="relative bg-white shadow-lg border border-gray-300"
        style={{ width: "max-content" }}
      >
        <Document
          file={location.state?.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="block"
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
          {signer}
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;