const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");

const upload = require("../middleware/upload");
const Document = require("../models/document");
const sendMail = require("../utils/mailer");

router.post(
  "/upload",
  upload.single("pdf"),
  async (req, res) => {
    try {
      const token = uuidv4();
      const document = new Document({
        originalName: req.file.originalname,
        filePath: req.file.path,
        token: token
      });
      await document.save();
      const signLink = `http://localhost:5173/sign/${token}`;

      await sendMail(
       "mm0981389@gmail.com",
       "Document Signature Link",
       `Please sign the document using this link:\n${signLink}`
       );

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

router.get("/sign/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const doc = await Document.findOne({ token });

    if (!doc) {
      return res.status(404).json({
        message: "Invalid token"
      });
    }

    res.json({
      message: "Document found",
      filePath: doc.filePath,
      originalName: doc.originalName,
      fileId: doc._id
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// 🔥 Delete a document by ID
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // (Optional) अगर आप चाहें तो fs.unlinkSync से फाइल अपलोड फोल्डर से भी डिलीट कर सकती हैं
    res.json({ message: "Document deleted successfully from database" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;