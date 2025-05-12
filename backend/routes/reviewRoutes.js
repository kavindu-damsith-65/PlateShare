const express = require("express");
const { 
    getAllReviews, 
    getReviewById, 
    createReview, 
    updateReview, 
    deleteReview,
    getUserRestaurantReviews
} = require("../controllers/reviewController");

const router = express.Router();

// Get all reviews for a restaurant
router.get("/all/:restaurantId", getAllReviews);

// Get a specific review by ID
router.get("/one/:id", getReviewById);

// Create a new review
router.post("/", createReview);

// Update a review
router.patch("/:id", updateReview);

// Delete a review
router.delete("/:id", deleteReview);

// Add new endpoint to get reviews by user ID and restaurant ID
router.get("/user/:userId/restaurant/:restaurantId", getUserRestaurantReviews);

module.exports = router;
