const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const reactionSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  targetType: {
    type: String,
    required: [true, "Target type is required"],
  },
  targetID: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Target ID is required"],
  },
  emoji: {
    type: Object,
    required: [false],
    default: { like: 0, love: 1, care: 0, laugh: 0, wow: 0, sad: 0, angry: 0 },
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
