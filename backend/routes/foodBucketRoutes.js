const express = require("express");
const { addToFoodBucket, getFoodBucketByUser, deleteFoodBucketItem, getFoodBucketByUserIdAndStatus } = require("../controllers/foodBucketController");

const router = express.Router();

// router.post("/add", placeOrder); 
router.post("/add", addToFoodBucket);
router.get("/:user_id", getFoodBucketByUser);
router.get("/ordered/:user_id", getFoodBucketByUserIdAndStatus);
router.delete("/:user_id/:product_id", deleteFoodBucketItem);

module.exports = router;
