const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controller/authController");
const validators = require("../middleware/validators");
const passport = require("passport");

// Login
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.login
);

// Login with Facebook
router.post(
  "/login/facebook",
  passport.authenticate("facebook-token", { session: false }),
  // passport.authenticate("facebook-token"),
  authController.loginWithFacebookOrGoogle
);

// Login with Google
router.post(
  "/login/google",
  passport.authenticate("google-token", { session: false }),
  // passport.authenticate("google-token"),
  authController.loginWithFacebookOrGoogle
);

module.exports = router;
