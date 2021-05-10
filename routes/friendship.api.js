const express = require("express");
const router = express.Router();
const friendshipController = require("../controller/friendshipController");
const authMiddleware = require("../middleware/authentication");

// Send a friend request
router.post(
  "/add/:id",
  authMiddleware.loginRequired,
  friendshipController.sendRequest
);

// Cancel a request
router.delete(
  "/add/:id",
  authMiddleware.loginRequired,
  friendshipController.cancelRequest
);

// Accept a friend request
router.post(
  "/manage/:id",
  authMiddleware.loginRequired,
  friendshipController.acceptRequest
);

// Decline a friend request
router.delete(
  "/manage/:id",
  authMiddleware.loginRequired,
  friendshipController.declineRequest
);

// Remove a friend
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  friendshipController.removeRequest
);

// Get the list of sent requests
router.get(
  "/add",
  authMiddleware.loginRequired,
  friendshipController.getListOfSentRequests
);

// Get the list of received requests
router.get(
  "/manage",
  authMiddleware.loginRequired,
  friendshipController.getListOfReceivedRequests
);

// Get the list of friends
router.get(
  "/",
  authMiddleware.loginRequired,
  friendshipController.getListOfFriends
);

module.exports = router;
