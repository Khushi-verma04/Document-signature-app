import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SignDocument() {
  const { token } = useParams();

  const [doc, setDoc] = useState(null);
  const [signer, setSigner] = useState("");
  const [x, setX] = useState(200);
  const [y, setY] = useState(350);

  // 🔥 Fetch document by token
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/signatures/sign/${token}`
        );

        console.log("DOC RESPONSE:", res.data);

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

  // 🔥 Submit signature
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/signatures", {
        fileId: doc?.fileId, // Fixed: Added optional chaining to prevent crash if doc is null
        signer,
        x: Number(x), // Fixed: Converted string to number
        y: Number(y)  // Fixed: Converted string to number
      });

      alert("Signed Successfully!");
      console.log(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (!doc?.filePath) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign Document</h2>

      <p><b>File:</b> {doc.originalName}</p>

      <iframe
        src={`http://localhost:5000/${doc.filePath.replace(/\\/g, "/")}`}
        width="100%"
        height="500px"
      ></iframe>

      <br />

      <input
        placeholder="Your Name"
        value={signer}
        onChange={(e) => setSigner(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="X position"
        type="number" // Fixed: Changed to number input
        value={x}
        onChange={(e) => setX(e.target.value)}
      />

      <input
        placeholder="Y position"
        type="number" // Fixed: Changed to number input
        value={y}
        onChange={(e) => setY(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Sign Document
      </button>
    </div>
  );
}

export default SignDocument;