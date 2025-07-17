const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.put("/promote/:id", isAdmin, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: "admin" });
        res.json({ msg: "User promoted" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.delete("/:id", isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
