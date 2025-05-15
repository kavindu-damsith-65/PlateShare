const express = require("express");
const {showNearByProducts, getRecommendedProducts, fetchCategories, getProductsByCategory, searchProductsAndRestaurants,getProductsByRestaurant} = require("../controllers/productController");

const router = express.Router();
router.get("/nearby/:location", showNearByProducts);
router.get("/recommendations/:userId", getRecommendedProducts);
router.get("/categories", fetchCategories);
router.get('/category/:categoryId/:location', getProductsByCategory);
router.get('/search/:query/:location', searchProductsAndRestaurants);
router.get('/seller/:restaurantId', getProductsByRestaurant);

module.exports = router;
