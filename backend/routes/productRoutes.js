const express = require("express");
const {showNearByProducts, getRecommendedProducts} = require("../controllers/productController");

const router = express.Router();
router.get("/:location", showNearByProducts);
router.get("/recommendations/:userId", getRecommendedProducts);

module.exports = router;
