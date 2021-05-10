const mongoose = require("mongoose");
require("dotenv").config();

const blogSchema = mongoose.Schema(
  {
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      care: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
    images: {
      type: String,
      required: [false],
      default: "",
    },
    reviewCount: {
      type: Number,
      required: [false],
      default: 0,
    },
    isDelete: {
      type: Boolean,
      required: [false],
      default: false,
    },
    title: { type: String, required: [true, "Blog title is required"] },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    reviews: {
      type: mongoose.Schema.Types.Array,
      ref: "Review",
      required: [false],
      default: [],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
