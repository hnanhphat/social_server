const mongoose = require("mongoose");
require("dotenv").config();

const reviewSchema = mongoose.Schema(
  {
    reactions: {
      type: Object,
      required: [false],
      default: {
        like: 0,
        love: 0,
        care: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog is required"],
    },
    content: { type: String, required: [true, "Content is required"] },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
