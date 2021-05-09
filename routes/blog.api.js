const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const authMiddleware = require("../middleware/authentication");

// Create a new blog
router.post("/", authMiddleware.loginRequired, blogController.createBlog);

// Get a single blog
router.get("/:id", blogController.getSingleBlog);

// Get list of blogs
router.get("/", blogController.getListOfBlogs);

// Update a single blog
router.put(
  "/:id",
  authMiddleware.loginRequired,
  blogController.updateSingleBlog
);

// Delete a single blog
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  blogController.deleteSingleBlog
);

module.exports = router;
