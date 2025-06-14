const express = require("express");
const { getFoodBucketByUser, deleteFoodBucketItem, placeOrder } = require("../controllers/foodBucketController");

const router = express.Router();

router.post("/add", placeOrder); 
router.get("/:user_id", getFoodBucketByUser);

module.exports = router;
