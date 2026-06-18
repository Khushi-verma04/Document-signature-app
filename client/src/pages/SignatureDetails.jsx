import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SignatureDetails() {
  const [name, setName] = useState("");
  const [selectedFont, setSelectedFont] = useState("cursive");

  const navigate = useNavigate();
  const location = useLocation();

  // 5 बिल्कुल अलग और 100% काम करने वाले इन-बिल्ट सिस्टम फॉन्ट्स की लिस्ट
  const fontOptions = [
    { id: "cursive", name: "Brush Script", style: { fontFamily: "'Segoe Script', 'Comic Sans MS', cursive", fontStyle: "italic" } },
    { id: "serif", name: "Elegant Italic Serif", style: { fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" } },
    { id: "monospace", name: "Classic Monospace", style: { fontFamily: "'Courier New', Courier, monospace", fontWeight: "bold" } },
    { id: "fantasy", name: "Casual Handwriting", style: { fontFamily: "'Comic Sans MS', Impact, fantasy" } },
    { id: "sans", name: "Modern Clean Bold", style: { fontFamily: "Arial, Helvetica, sans-serif", fontWeight: "black" } },
  ];

  return (
    <div className="flex justify-center mt-12 px-4 font-sans">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Set your signature details</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name to generate signatures"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-slate-700"
          />
        </div>

        {/* नाम टाइप होने पर ही फॉन्ट ऑप्शन्स दिखाई देंगे */}
        {name.trim() !== "" && (
          <>
            {/* ऊपर की लाइन को भी बदलकर डायनामिक कर दिया है ताकि जितने फॉन्ट हैं उतनी ही संख्या दिखे */}
            <h3 className="text-base font-bold text-slate-700 mb-4">
              Choose Signature Style ({fontOptions.length} Different Options)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fontOptions.map((font) => (
                <div
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all flex items-center justify-center min-h-[70px] border-2 text-2xl bg-slate-50/50 ${
                    selectedFont === font.id
                      ? "border-orange-500 bg-orange-50/30 text-orange-600 font-bold animate-pulse"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                  style={font.style}
                >
                  {name}
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => {
            if (!name.trim()) {
              alert("Please enter your name first!");
              return;
            }
            navigate("/viewer", {
              state: {
                signer: name,
                selectedFont: selectedFont,
                pdfUrl: location.state?.pdfUrl,
                fileId: location.state?.fileId,
              },
            });
          }}
          className="mt-8 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-center text-lg cursor-pointer"
        >
          Apply Signature
        </button>
      </div>
    </div>
  );
}

export default SignatureDetails;