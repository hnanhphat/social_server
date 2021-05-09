const Blog = require("../model/blog");
const Reaction = require("../model/reaction");
const Review = require("../model/review");

const reactionController = {};

// Reaction blog or review
reactionController.createReaction = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      targetType,
      targetID,
      like,
      love,
      care,
      laugh,
      wow,
      sad,
      angry,
    } = req.body;
    let reaction;

    const isExist = await Reaction.findOne({ targetID: targetID });

    if (targetType == "Blog") {
      if (isExist) {
        if (isExist.author == userId) {
          reaction = await Reaction.findOneAndUpdate(
            { targetID: targetID },
            {
              emoji: {
                like: like,
                love: love,
                care: care,
                laugh: laugh,
                wow: wow,
                sad: sad,
                angry: angry,
              },
            },
            { new: true }
          );
        } else {
          reaction = await Reaction.findOneAndUpdate(
            { targetID: targetID },
            {
              $inc: {
                "emoji.like": like,
                "emoji.love": love,
                "emoji.care": care,
                "emoji.laugh": laugh,
                "emoji.wow": wow,
                "emoji.sad": sad,
                "emoji.angry": angry,
              },
            },
            { new: true }
          );
        }
      } else {
        reaction = new Reaction({
          author: userId,
          targetType: targetType,
          targetID: targetID,
          emoji: {
            like: like,
            love: love,
            care: care,
            laugh: laugh,
            wow: wow,
            sad: sad,
            angry: angry,
          },
        });
        await reaction.save();
      }

      const blog = await Blog.findByIdAndUpdate(
        targetID,
        { reactions: reaction },
        { new: true }
      );
    } else if (targetType == "Review") {
    }

    // const reaction = new Reaction({
    //   targetType: targetType,
    //   targetID: targetID,
    //   emoji: {
    //     like: like,
    //     love: love,
    //     care: care,
    //     laugh: laugh,
    //     wow: wow,
    //     sad: sad,
    //     angry: angry,
    //   },
    // });
    // await reaction.save();

    // if (targetType == "Blog") {
    //   const blog = await Blog.findByIdAndUpdate(
    //     targetID,
    //     { reactions: emoji },
    //     { new: true }
    //   );
    // } else if (targetType == "Review") {
    //   const review = await Review.findByIdAndUpdate(
    //     targetID,
    //     { reactions: emoji },
    //     { new: true }
    //   );
    // }

    res.status(200).json({
      success: true,
      data: reaction,
      message: "Add reaction successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = reactionController;
