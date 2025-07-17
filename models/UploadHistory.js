const mongoose = require("mongoose");

const uploadHistorySchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("UploadHistory", uploadHistorySchema);
