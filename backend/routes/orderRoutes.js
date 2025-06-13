const express = require('express');
const { getOrdersByRestaurantId } = require('../controllers/orderController');

const router = express.Router();

router.get('/:restaurantId', getOrdersByRestaurantId);

module.exports = router;


