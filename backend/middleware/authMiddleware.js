const jwt = require("jsonwebtoken");
const {User} = require("../models/AuthModel");
require("dotenv").config();


const authMiddleware = async (req, res, next) => {
    // const transaction = await sequelize.transaction();

    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: { id: decoded.id }
        });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // // Optional: Check if user is active
        // if (user.status !== "active") {
        //     return res.status(403).json({ error: "User account is inactive" });
        // }

        req.user = user;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        console.error("Authentication error:", error);
        res.status(500).json({ error: "Authentication failed" });
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
