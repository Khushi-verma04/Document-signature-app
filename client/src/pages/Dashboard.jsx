import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Replace this with your real fileId
  const fileId = "6a2c2b62ed5374217bbb9f42";

  // 🔥 Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/signatures/audit/${fileId}`
        );

        setData(res.data.audits || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 Filter logic
  const filteredData =
    filter === "all"
      ? data
      : data.filter((item) => item.status === filter);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* 🔥 Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${
            filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-white"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("signed")}
          className={`px-4 py-2 rounded ${
            filter === "signed"
              ? "bg-green-600 text-white"
              : "bg-white"
          }`}
        >
          Signed
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded ${
            filter === "rejected"
              ? "bg-red-600 text-white"
              : "bg-white"
          }`}
        >
          Rejected
        </button>
      </div>

      {/* 🔥 Loading State */}
      {loading ? (
        <p className="text-gray-600">Loading data...</p>
      ) : (
        <div className="grid gap-4">

          {/* No data case */}
          {filteredData.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            filteredData.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    Signer: {item.signer}
                  </p>

                  <p className="text-sm text-gray-500">
                    IP: {item.ipAddress}
                  </p>

                  <p className="text-sm text-gray-400">
                    Time:{" "}
                    {new Date(item.signedAt).toLocaleString()}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    item.status === "pending"
                      ? "bg-yellow-500"
                      : item.status === "signed"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;