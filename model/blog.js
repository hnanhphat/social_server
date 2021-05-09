const mongoose = require("mongoose");
require("dotenv").config();

const blogSchema = mongoose.Schema(
  {
    reactions: {
      type: mongoose.Schema.Types.Array,
      required: [false],
      ref: "Reaction",
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
    images: {
      type: Object,
      required: [false],
      default: [],
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
