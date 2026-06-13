const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true
  },
  signer: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ["pending", "signed", "rejected"],
    default: "pending"
  },
  reason: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Signature", signatureSchema);