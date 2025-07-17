const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const isAdmin = require("../middlewares/isAdmin");

router.post("/register", register);
router.post("/login", login);
router.get("/admin/users", isAdmin, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
