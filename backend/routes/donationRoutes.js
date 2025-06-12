const express = require("express");
const { createDonation } = require("../controllers/donationController");

const router = express.Router();

router.post("/:restaurantId", createDonation);

module.exports = router;