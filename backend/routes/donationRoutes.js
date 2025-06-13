const express = require("express");
const { createDonation, getDonationsByRestaurantId } = require("../controllers/donationController");

const router = express.Router();

router.post("/:restaurantId", createDonation);
router.get("/:restaurantId", getDonationsByRestaurantId);

module.exports = router;