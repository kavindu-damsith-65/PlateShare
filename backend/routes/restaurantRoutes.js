const express = require("express");
const {showNearByRestaurants, showRestaurantDetails} = require("../controllers/restaurantController");

const router = express.Router();
router.get("/unique/:id", showRestaurantDetails);
router.get("/:location", showNearByRestaurants);

module.exports = router;
