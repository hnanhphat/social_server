const Blog = require("../model/blog");
const Review = require("../model/review");

const reviewController = {};

// Get list of reviews of a blog
reviewController.getListOfReview = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total review number
    const totalReview = await Review.countDocuments({
      blog: req.params.id,
      ...filter,
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalReview / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get blog based on query info
    const reviews = await Review.find({
      $and: [{ blog: req.params.id }, { ...filter }],
    })
      .skip(offset)
      .limit(limit);

    // 6. Send reviews + totalPages info
    res.status(200).json({
      success: true,
      data: { reviews: reviews, totalPages },
      message: "Get blog's review successful",
    });

    // const reviews = await Review.find({ blog: req.params.id });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Create a review
reviewController.createReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const blogId = req.params.id;
    const { content } = req.body;
    const isExist = await Blog.findById(blogId);
    if (!isExist) {
      throw new Error("Blog not found");
    }

    const reviews = new Review({
      author: userId,
      blog: blogId,
      content: content,
    });
    await reviews.save();

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { reviewCount: 1 }, $push: { reviews: reviews } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: { reviews },
      message: "Create new review successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a review
reviewController.updateReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.id;
    const { content } = req.body;

    const reviewAuthor = await Review.findById(reviewId);
    if (userId != reviewAuthor.author) {
      throw new Error("You cannot edit the other user's review");
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { content: content },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: review,
      message: "Update review successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a review
reviewController.deleteReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.id;

    const reviewAuthor = await Review.findById(reviewId);
    if (userId != reviewAuthor.author) {
      throw new Error("You cannot delete the other user's review");
    }

    const review = await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      data: review,
      message: "Delete review successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = reviewController;
