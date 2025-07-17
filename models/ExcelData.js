const mongoose = require("mongoose");

const ExcelDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    filename: String,
    sheetName: String,
    data: [Object],
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ExcelData", ExcelDataSchema);
