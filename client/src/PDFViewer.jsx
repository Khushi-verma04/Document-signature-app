import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";

function PDFViewer() {
  const location = useLocation();

  const pdfRef = useRef(null);

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const saveSignature = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/signatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: location.state?.fileId,
          signer: "test@gmail.com",
          x: position.x,
          y: position.y,
        }),
      });

      const data = await response.json();

      console.log(data);
      if (!response.ok) {
        throw new Error(data.message);
      }
      alert("Signature saved successfully");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>PDF Viewer Page</h1>
      <button onClick={saveSignature}>
        Save Signature
      </button>

      <div ref={pdfRef} style={{ position: "relative" }}>
        <iframe
          src={location.state?.pdfUrl}
          width="100%"
          height="700px"
        ></iframe>

        <div
          draggable
          onDragStart={(e) => {
            setOffset({
              x: e.clientX - position.x,
              y: e.clientY - position.y,
            });
          }}
          onDragEnd={(e) => {
            const rect = pdfRef.current.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setPosition({
              x,
              y,
            });
          }}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            width: "120px",
            height: "40px",
            border: "2px dashed blue",
            backgroundColor: "rgba(0,0,255,0.1)",
            textAlign: "center",
            lineHeight: "40px",
            cursor: "move",
          }}
        >
          Sign Here
        </div>
      </div>

    </div>
  );
}

export default PDFViewer;