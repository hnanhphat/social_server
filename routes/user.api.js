const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authentication");

// Register
router.post("/", userController.register);

// Get current user
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

// Get list of users
router.get("/", userController.getListOfUsers);

// Update profile
router.put("/", authMiddleware.loginRequired, userController.updateProfile);

// Verify Email
router.post("/verify_email", userController.verifyEmail);

module.exports = router;
