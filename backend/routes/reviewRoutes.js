const express = require("express");
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();
router.get("/all/:restaurantId", getAllReviews);
router.get("/one/:id", getReviewById);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;