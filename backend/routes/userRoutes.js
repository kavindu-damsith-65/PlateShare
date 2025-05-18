const express = require("express");
const { getSellerDetails, getBuyerDetails, getOrgDetails } = require("../controllers/userController");

const router = express.Router();

// Get user details by role
router.get("/seller/:id", getSellerDetails);
router.get("/buyer/:id", getBuyerDetails);
router.get("/organization/:id", getOrgDetails);

module.exports = router;
