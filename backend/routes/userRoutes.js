const express = require("express");
const { getSellerDetails } = require("../controllers/userController");

const router = express.Router();
router.get("/seller/:id", getSellerDetails);

module.exports = router;
