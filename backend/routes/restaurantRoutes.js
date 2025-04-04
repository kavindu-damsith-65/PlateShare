const express = require("express");
const {showNearByRestaurants} = require("../controllers/restaurantController");

const router = express.Router();
router.get("/:location", showNearByRestaurants);

module.exports = router;
