const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
        return res.status(403).json({ msg: "Admins only" });
    }

    req.user = decoded;
    next();
};
