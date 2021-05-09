const User = require("../model/user");
const bcrypt = require("bcrypt");

const userController = {};

// Register
userController.register = async (req, res, next) => {
  try {
    const { avatarUrl, username, email, password } = req.body;
    // Encode password first
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    // And save encode password
    const user = new User({
      avatarUrl: avatarUrl,
      username: username,
      email: email,
      password: encodedPassword,
    });
    await user.save();

    res.status(200).json({
      success: true,
      data: { user: user },
      message: "Create user successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get current user
userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Get current user successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of users
userController.getListOfUsers = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total user number
    const totalUsers = await User.countDocuments({ ...filter });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalUsers / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get user based on query info
    const users = await User.find(filter).skip(offset).limit(limit);

    // 6. Send users + totalPages info
    res.status(200).json({
      status: "Success",
      data: { users: users, totalPages },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update current user's profile
userController.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { avatarUrl, username, email, password } = req.body;
    // Encode password first
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);

    // And save encode password
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: avatarUrl,
        username: username,
        email: email,
        password: encodedPassword,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: userUpdate,
      message: "Update Profile successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = userController;
