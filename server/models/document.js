const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Document", documentSchema);