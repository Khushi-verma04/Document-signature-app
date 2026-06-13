const express = require("express");
const router = express.Router();

const Signature = require("../models/Signature");
const Document = require("../models/document");
const stampPDF = require("../utils/pdfStamp");
const auditMiddleware = require("../middleware/auditMiddleware");
const Audit = require("../models/Audit");


// 🔥 Public signing link
router.get("/sign/:token", async (req, res) => {
  try {
    const token = req.params.token;

    console.log("TOKEN HIT:", token); // 👈 DEBUG

    const doc = await Document.findOne({ token });

    if (!doc) {
      return res.status(404).json({
        message: "Invalid token",
      });
    }

    return res.json({
      message: "Document found",
      filePath: doc.filePath,
      originalName: doc.originalName,
      fileId: doc._id
    });

  } catch (err) {
    console.log("SIGN GET ERROR:", err); // 👈 IMPORTANT
    return res.status(500).json({
      message: "Server error in sign route"
    });
  }
});


// 🔥 Save signature + stamp PDF
router.post("/", auditMiddleware, async (req, res) => {
  try {
    const { fileId, signer, x, y } = req.body;

    console.log("SIGN POST HIT:", req.body); // 👈 DEBUG

    const document = await Document.findById(fileId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const inputPath = document.filePath;
    const outputPath = inputPath.replace(".pdf", "-signed.pdf");

    // Fixed: Numbers convert kiye taaki pdfStamp engine core numbers extract kar sake, strings nahi
    await stampPDF(inputPath, outputPath, Number(x), Number(y)); 

    const signature = await Signature.create({
      fileId,
      signer,
      x: Number(x), // Fixed: Formatted data type before saving to DB
      y: Number(y)  // Fixed: Formatted data type before saving to DB
    });

    await Audit.create({
    fileId,
    signer,
    ipAddress: req.ipAddress,
    signedAt: new Date()
    });

    return res.status(201).json({
      message: "Signature saved successfully",
      signature,
      signedPdfPath: outputPath
    });

  } catch (error) {
    console.log("SIGN POST ERROR:", error); // 👈 IMPORTANT
    return res.status(500).json({
      message: "Server error in signature save"
    });
  }
});

router.get("/audit/:fileId", async (req, res) => {
  try {
    const audits = await Audit.find({ fileId: req.params.fileId });

    return res.json({
      message: "Audit trail fetched successfully",
      audits
    });

  } catch (error) {
    console.log("AUDIT ERROR:", error);
    return res.status(500).json({
      message: "Server error while fetching audit"
    });
  }
});

module.exports = router;