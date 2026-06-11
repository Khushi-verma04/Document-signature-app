require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const documentRoutes = require("./routes/document");
const signatureRoutes = require("./routes/signatureRoutes");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads", 
express.static(path.join(__dirname,"uploads")));

const authRoutes = require("./routes/auth");


app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/signatures",signatureRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
})
.catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/test", (req, res) => {
  res.json({ message: "XYZ123" });
});


app.get("/check-upload", (req, res) => {
  res.sendFile(
    path.join(__dirname, "uploads", "1780734934869-khushi.resume.pdf")
  );
});