const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const ExcelData = require("../models/ExcelData");
const UploadHistory = require("../models/UploadHistory");
const isAdmin = require("../middlewares/isAdmin");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/excel", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await ExcelData.create({
            user: userId,
            filename: req.file.originalname,
            sheetName,
            data: sheetData,
        });

        await UploadHistory.create({
            fileName: req.file.originalname,
            user: userId,
        });

        res.status(200).json({ sheetName, data: sheetData });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get("/admin/all", isAdmin, async (req, res) => {
    try {
        const uploads = await ExcelData.find().populate("user", "name email");
        res.json(uploads);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get("/history", authMiddleware, async (req, res) => {
    try {
        const history = await UploadHistory.find({ user: req.user.id }).sort({ uploadedAt: -1 });
        res.status(200).json({ history });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get("/user-stats", authMiddleware, async (req, res) => {
    try {
        const totalUploads = await ExcelData.countDocuments({ user: req.user.id });
        const lastUpload = await ExcelData.findOne({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            totalUploads,
            lastUploadDate: lastUpload ? lastUpload.createdAt : null,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


module.exports = router;
