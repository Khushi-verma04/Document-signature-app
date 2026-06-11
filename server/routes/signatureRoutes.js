const express = require("express");
const router = express.Router();

const Signature = require("../models/Signature");
const Document = require("../models/Document");
const stampPDF = require("../utils/pdfStamp");

router.post("/", async (req, res) => {
  try {

    const { fileId, signer, x, y } = req.body;

    const document = await Document.findById(fileId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const inputPath = document.filePath;
    const outputPath = inputPath.replace(".pdf", "-signed.pdf");

    await stampPDF(inputPath, outputPath, x, y);

    const signature = await Signature.create({
      fileId,
      signer,
      x,
      y
    });

    res.status(201).json({
      message: "Signature saved and PDF stamped successfully",
      signature,
      signedPdfPath: outputPath
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;