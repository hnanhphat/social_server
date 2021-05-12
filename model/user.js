const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    avatarUrl: {
      type: String,
      required: [false],
      trim: true,
      default: "",
    },
    friendCount: { type: Number, required: [false], default: 0 },
    friendship: { type: String, required: false, default: "" },
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    isDelete: { type: Boolean, required: [false], default: false },
    emailVerificationCode: { type: String, select: false },
    emailVerified: { type: Boolean, require: true, default: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ email: profile.email }, async function (error, result) {
    if (!result) {
      // Create new user
      // 1. Make new password
      let newPassword =
        profile.password || "" + Math.floor(Math.random() * 100000000);
      // let newPassword = "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);

      // 2. Save user
      userObj.name = profile.name;
      userObj.email = profile.email;
      userObj.password = newPassword;
      userObj.googleId = profile.googleId;
      userObj.facebookId = profile.facebookId;
      userObj.avatarurl = profile.avatarurl;

      // 3. Call the cb
      userObj.save(cb);
    } else {
      // Send that user information back to passport
      cb(error, result);
    }
  });
};

// Generate token
userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
