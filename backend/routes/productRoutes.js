const express = require("express");
const {showNearByProducts, getRecommendedProducts, fetchCategories, getProductsByCategory, searchProductsAndRestaurants} = require("../controllers/productController");

const router = express.Router();
router.get("/nearby/:location", showNearByProducts);
router.get("/recommendations/:userId", getRecommendedProducts);
router.get("/categories", fetchCategories);
router.get('/category/:categoryId/:location', getProductsByCategory);
router.get('/search/:query/:location', searchProductsAndRestaurants);

module.exports = router;
