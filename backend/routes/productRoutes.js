const express = require("express");
const {showNearByProducts, getRecommendedProducts, fetchCategories} = require("../controllers/productController");

const router = express.Router();
router.get("/nearby/:location", showNearByProducts);
router.get("/recommendations/:userId", getRecommendedProducts);
router.get("/categories", fetchCategories);

module.exports = router;
