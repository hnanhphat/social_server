const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const authMiddleware = require("../middleware/authentication");

// Get list of reviews of a blog
router.get("/blogs/:id", reviewController.getListOfReview);

// Create a review
router.post(
  "/blogs/:id",
  authMiddleware.loginRequired,
  reviewController.createReview
);

// Update a review
router.put("/:id", authMiddleware.loginRequired, reviewController.updateReview);

// Delete a review
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  reviewController.deleteReview
);

module.exports = router;
