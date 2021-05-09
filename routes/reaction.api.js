const express = require("express");
const router = express.Router();
const reactionController = require("../controller/reactionController");
const authMiddleware = require("../middleware/authentication");

// Reaction blog or review
router.post(
  "/",
  authMiddleware.loginRequired,
  reactionController.createReaction
);

module.exports = router;
