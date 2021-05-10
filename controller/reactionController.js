const Reaction = require("../model/reaction");
const mongoose = require("mongoose");

const reactionController = {};

reactionController.createReaction = async (req, res, next) => {
  try {
    const { targetType, targetId, emoji } = req.body;
    const targetObj = await mongoose.model(targetType).findById(targetId);
    if (!targetObj) {
      throw new Error(`${targetType} not found`);
    }

    let reaction = await Reaction.findOne({
      author: req.userId,
      targetType,
      targetId,
    });
    let message = "";

    if (!reaction) {
      await Reaction.create({
        author: req.userId,
        targetType,
        targetId,
        emoji,
      });
      message = "Add reaction successful";
    } else {
      if (reaction.emoji === emoji) {
        await Reaction.findOneAndDelete({ _id: reaction._id });
        message = "Remove reaction successful";
      } else {
        await Reaction.findOneAndUpdate({ _id: reaction._id }, { emoji });
        message = "Update reaction successful";
      }
    }

    const reactionStat = await mongoose
      .model(targetType)
      .findById(targetId, "reactions");

    let current = {};
    let updateTo = {};
    if (!reaction) {
      updateTo[`reactions.${emoji}`] = 1;
      await mongoose
        .model(targetType)
        .findByIdAndUpdate(targetId, { $inc: updateTo }, { new: true });
    } else {
      if (reaction.emoji === emoji) {
        updateTo[`reactions.${emoji}`] = -1;
        await mongoose
          .model(targetType)
          .findByIdAndUpdate(targetId, { $inc: updateTo }, { new: true });
      } else {
        current[`reactions.${reaction.emoji}`] = -1;
        updateTo[`reactions.${emoji}`] = 1;
        await mongoose
          .model(targetType)
          .findByIdAndUpdate(targetId, { $inc: current }, { new: true });
        await mongoose
          .model(targetType)
          .findByIdAndUpdate(targetId, { $inc: updateTo }, { new: true });
      }
    }

    res.status(200).json({
      success: true,
      data: reactionStat.reaction,
      message: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Bitna do
// reactionController.createReaction = async (req, res, next) => {
//   try {
//     // 1. Get the value from req.body
//     const { targetType, targetId, emoji } = req.body;

//     // 2. Check if that target Id is exist
//     const targetObj = await mongoose.model(targetType).findById(targetId);
//     if (!targetObj) {
//       throw new Error(`${targetType} not found`);
//     }

//     // 3. Check if that reaction is exist
//     let reaction = await Reaction.findOne({
//       author: req.userId,
//       targetType,
//       targetId,
//     });

//     // 4. If reaction is not exist, create new one
//     if (!reaction) {
//       const newReaction = new Reaction({
//         author: req.userId,
//         targetType,
//         targetId,
//         emoji,
//       });
//       await newReaction.save();
//     } else {
//       // 5. If reaction is exist
//       if (reaction.emoji !== emoji) {
//         // 5-1. If exist reaction is different with upcoming reaction then update
//         await Reaction.findOneAndUpdate({ _id: reaction._id }, { emoji });
//       } else {
//         // 5-2. If its same -> delete
//         await Reaction.findOneAndDelete({ _id: reaction._id });
//       }
//     }

//     // 6. Update the reaction status (calculate reaction) => in reaction model
//     // 7. Response
//     const reactionState = await mongoose
//       .model(targetType)
//       .findById(targetId, "reactions");

//     res.status(200).json({
//       success: true,
//       data: reactionState.reactions,
//       message: "Add emoji successfull",
//     });
//   } catch (error) {}
// };

module.exports = reactionController;
