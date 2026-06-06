require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const documentRoutes = require("./routes/document");

const app = express();

const authRoutes = require("./routes/auth");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});