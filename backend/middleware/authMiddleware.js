const jwt = require("jsonwebtoken");
const User = require("../models/AuthModel");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
        if (!req.user) return res.status(401).json({ error: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Forbidden" });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
