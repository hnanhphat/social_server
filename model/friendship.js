const mongoose = require("mongoose");
require("dotenv").config();

const friendshipSchema = mongoose.Schema({
  status: {
    type: String,
    required: false,
    default: "",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User is required"],
    ref: "User",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User is required"],
    ref: "User",
  },
});

const Friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = Friendship;
