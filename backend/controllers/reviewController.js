const sequelize = require("../config/db");
const { Review, Restaurant, User } = require("../models/AuthModel");
const { Op } = require("sequelize");

// Get all reviews related to a specific restaurant
exports.getAllReviews = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const reviews = await Review.findAll({
            where: { restaurant_id: restaurantId },
            attributes: ["id", "rating", "description","createdAt"],
            include: [
                { model: Restaurant, attributes: ["name"] },
                { model: User, attributes: ["name"] }
            ]
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this restaurant" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id, {
            include: [
                { model: Restaurant, attributes: ["name"] },
                { model: User, attributes: ["name"] }
            ]
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { description, rating, restaurant_id, user_id } = req.body;

        const newReview = await Review.create({
            description,
            rating,
            restaurant_id,
            user_id
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// delete a review by id
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await review.destroy();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, rating } = req.body;

        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.description = description || review.description;
        review.rating = rating || review.rating;

        await review.save();

        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get reviews by user ID and restaurant ID
exports.getUserRestaurantReviews = async (req, res) => {
    try {
        const { userId, restaurantId } = req.params;

        // Validate parameters
        if (!userId || !restaurantId) {
            return res.status(400).json({ message: "User ID and Restaurant ID are required" });
        }

        // Find reviews that match both user ID and restaurant ID
        const reviews = await Review.findAll({
            where: {
                user_id: userId,
                restaurant_id: restaurantId
            },
            include: [
                {
                    model: Restaurant,
                    attributes: ['name']
                },
                {
                    model: User,
                    attributes: ['name']
                }
            ],
            order: [['createdAt', 'DESC']] // Most recent reviews first
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching user restaurant reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};
