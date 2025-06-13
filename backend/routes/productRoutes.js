const express = require("express");
const {showNearByProducts, getRecommendedProducts, fetchCategories, getProductsByCategory, searchProductsAndRestaurants,getProductsByRestaurant, removeProductOfRestaurant, CreateProductOfRestaurant, getProductCountByRestaurant, updateProductOfRestaurant} = require("../controllers/productController");

const router = express.Router();
router.get("/nearby/:location", showNearByProducts);
router.get("/recommendations/:userId", getRecommendedProducts);
router.get("/categories", fetchCategories);
router.get('/category/:categoryId/:location', getProductsByCategory);
router.get('/search/:query/:location', searchProductsAndRestaurants);
router.get('/seller/:restaurantId', getProductsByRestaurant);
router.delete('/seller/remove/:productId/:restaurantId', removeProductOfRestaurant);
router.post('/seller/add/:restaurantId', CreateProductOfRestaurant);
router.put('/seller/update/:productId/:restaurantId', updateProductOfRestaurant);
router.get("/count/:restaurantId", getProductCountByRestaurant);

module.exports = router;
