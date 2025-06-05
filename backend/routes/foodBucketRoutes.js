const express = require("express");
const { addToFoodBucket, getFoodBucketByUser, deleteFoodBucketItem } = require("../controllers/foodBucketController");

const router = express.Router();

router.post("/add", addToFoodBucket); 
router.get("/:user_id", getFoodBucketByUser);
router.delete("/:user_id/:product_id", deleteFoodBucketItem);

module.exports = router;
