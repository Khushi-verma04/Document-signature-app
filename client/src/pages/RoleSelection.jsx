import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const fileId = location.state?.fileId;
  const pdfUrl = location.state?.pdfUrl;

  // स्टेट्स (States) ईमेल इनपुट बॉक्स और लोडिंग को मैनेज करने के लिए
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("RoleSelection state =", location.state);

  // 1. खुद हस्ताक्षर करने के लिए (Only Me)
  const handleOnlyMe = () => {
    navigate("/signature-details", {
      state: { fileId, pdfUrl }
    });
  };

  // 2. दूसरों को ईमेल भेजने के लिए (Several People)
  const handleSendInvitation = async () => {
    if (!inviteEmail) {
      alert("कृपया उस व्यक्ति का ईमेल आईडी डालें जिसे आप डॉक्यूमेंट भेजना चाहती हैं!");
      return;
    }

    setLoading(true);
    try {
      // आपके नए /api/docs/invite एंडपॉइंट को हिट करना
      const response = await fetch("http://localhost:5000/api/docs/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: fileId,
          emails: [inviteEmail] // ईमेल को एरे के रूप में बैकएंड पर भेज रहे हैं
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invitation failed");

      alert("साइन करने का लिंक सफलतापूर्वक ईमेल पर भेज दिया गया है!");
      navigate("/"); // काम पूरा होने पर यूजर को वापस होम पेज पर भेजें
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
        
        {/* स्टेज 1: जब यूजर "Only Me" या "Several People" चुन रहा हो */}
        {!showEmailInput ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Who will sign this document?</h2>

            <div className="flex gap-6 justify-center">
              {/* Only Me बटन */}
              <button
                onClick={handleOnlyMe}
                className="w-36 h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-all cursor-pointer"
              >
                Only Me
              </button>

              {/* Several People बटन */}
              <button
                onClick={() => setShowEmailInput(true)}
                className="w-36 h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-all cursor-pointer"
              >
                Several People
              </button>
            </div>
          </>
        ) : (
          /* स्टेज 2: जब "Several People" पर क्लिक करने के बाद ईमेल बॉक्स खुलेगा */
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Invite Another Signer</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter the email address of the person who needs to sign this document.</p>

            <input
              type="email"
              placeholder="Signer's email (e.g. name@company.com)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all mb-6 text-gray-700"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowEmailInput(false)}
                className="w-1/2 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSendInvitation}
                disabled={loading}
                className="w-1/2 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-lg shadow transition-all"
              >
                {loading ? "Sending..." : "Send Link"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default RoleSelection;