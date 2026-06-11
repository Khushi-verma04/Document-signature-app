const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const Document = require("../models/document");

router.post(
  "/upload",
  upload.single("pdf"),
  async (req, res) => {
    try {
      const document = new Document({
        originalName: req.file.originalname,
        filePath: req.file.path,
      });

      await document.save();

      res.status(201).json({
        message: "PDF uploaded successfully",
        document,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.get("/all", async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;