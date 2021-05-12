const User = require("../model/user");
const bcrypt = require("bcrypt");

const authController = {};

// Login
authController.login = async (req, res, next) => {
  try {
    // Login process
    // 1. Get the email and password from body
    const { email, password } = req.body;

    // 2. Check that email is exist in database and verified
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("This email is not exist");
    } else if (!user.emailVerified) {
      throw new Error("This email is not verified");
    }

    // 3. Check the password is match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Wrong password");
    }

    // 4. Generate token
    const accessToken = await user.generateToken();

    // 5. Response
    res.status(200).json({
      success: true,
      data: { user: user, accessToken },
      message: "Login successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Login with Facebook or Google
authController.loginWithFacebookOrGoogle = async (req, res, next) => {
  try {
    let user = req.user;
    if (user) {
      user = await User.findByIdAndUpdate(
        user._id,
        { avatarUrl: user.avatarUrl }, // I want to get recent avatar from avatar picture from facebook
        { new: true }
      );

      const accessToken = await user.generateToken();

      res.status(200).json({
        success: true,
        data: { user, accessToken },
        message: "Login successful",
      });
    } else {
      throw new Error("Login fail");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = authController;
