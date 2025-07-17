const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ExcelData = require("../models/ExcelData");
const isAdmin = require("../middlewares/isAdmin");

router.get("/admin/overview", isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalUploads = await ExcelData.countDocuments();

        const fileTypeCount = await ExcelData.aggregate([
            {
                $group: {
                    _id: { $substr: ["$filename", { $subtract: [{ $strLenCP: "$filename" }, 4] }, 4] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        res.json({
            totalUsers,
            totalAdmins,
            totalUploads,
            topFileType: fileTypeCount[0]?._id || "N/A"
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get("/stats", isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFiles = await ExcelData.countDocuments();

        const uploadsByUser = await ExcelData.aggregate([
            { $group: { _id: "$user", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const fileTypeCounts = await ExcelData.aggregate([
            {
                $group: {
                    _id: { $substr: ["$filename", { $subtract: [{ $strLenCP: "$filename" }, 4] }, 4] },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalUsers,
            totalFiles,
            topUploaders: uploadsByUser,
            fileTypes: fileTypeCounts
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
