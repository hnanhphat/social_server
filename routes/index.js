var express = require("express");
var router = express.Router();

const authApi = require("./auth.api");
const blogApi = require("./blog.api");
const friendshipApi = require("./friendship.api");
const reactionApi = require("./reaction.api");
const reviewApi = require("./review.api");
const userApi = require("./user.api");
const email = require("../helpers/email");

router.get("/test-email", (req, res) => {
  email.sendTestEmail();
  res.send("email sent");
});

router.use("/auth", authApi);
router.use("/blogs", blogApi);
router.use("/friends", friendshipApi);
router.use("/reactions", reactionApi);
router.use("/reviews", reviewApi);
router.use("/users", userApi);

module.exports = router;
