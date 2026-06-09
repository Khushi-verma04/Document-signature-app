const express = require("express");
const router = express.Router();

const Signature = require("../models/Signature");

router.post("/add", async (req, res) => {
  try {
    const { fileId, signer, x, y } = req.body;

    const signature = await Signature.create({
      fileId,
      signer,
      x,
      y
    });

    res.status(201).json(signature);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;