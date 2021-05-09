var express = require("express");
var router = express.Router();

const authApi = require("./auth.api");
const blogApi = require("./blog.api");
const friendshipApi = require("./friendship.api");
const reactionApi = require("./reaction.api");
const reviewApi = require("./review.api");
const userApi = require("./user.api");

router.use("/auth", authApi);
router.use("/blogs", blogApi);
// router.use("/friendship", friendshipApi);
// router.use("/reaction", reactionApi);
router.use("/reviews", reviewApi);
router.use("/users", userApi);

module.exports = router;
