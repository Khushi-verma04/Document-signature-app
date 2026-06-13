require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const documentRoutes = require("./routes/document");
const signatureRoutes = require("./routes/signatureRoutes");
const authRoutes = require("./routes/auth");

const app = express();

// 🔥 Middlewares
app.use(cors());
app.use(express.json());

// 🔥 Static uploads folder (IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/signatures", signatureRoutes);

// 🔥 Test routes
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/test", (req, res) => {
  res.json({ message: "XYZ123" });
});

// 🔥 MongoDB + Server start
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });

})
.catch((err) => {
  console.log("MongoDB Error:", err);
});