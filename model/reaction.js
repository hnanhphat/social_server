const mongoose = require("mongoose");
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
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Target ID is required"],
  },
  emoji: {
    type: String,
    required: [true, "Emoji is required"],
    default: "",
  },
});

// reactionSchema.statics.calculateReaction = async function (
//   targetId,
//   targetType
// ) {
//   /**
//    * 1. Find the blog with target ID
//    * 2. Update the reaction object
//    * 2-1. Group by reaction emoji
//    * 2-2. Count
//    *
//    * Method you only can use when you have instance
//    * Statics you can use without instance
//    */

//   const states = await this.aggregate([
//     { $match: { targetId } },
//     {
//       $group: {
//         _id: "$targetId",
//         like: { $sum: { $cond: [{ $rq: ["$emoji", "like"] }, 1, 0] } },
//         love: { $sum: { $cond: [{ $rq: ["$emoji", "love"] }, 1, 0] } },
//         care: { $sum: { $cond: [{ $rq: ["$emoji", "care"] }, 1, 0] } },
//         laugh: { $sum: { $cond: [{ $rq: ["$emoji", "laugh"] }, 1, 0] } },
//         wow: { $sum: { $cond: [{ $rq: ["$emoji", "wow"] }, 1, 0] } },
//         sad: { $sum: { $cond: [{ $rq: ["$emoji", "sad"] }, 1, 0] } },
//         angry: { $sum: { $cond: [{ $rq: ["$emoji", "angry"] }, 1, 0] } },
//       },
//     },
//   ]);

//   // 3. Save into target object
//   await mongoose.model(targetType).findByIdAndUpdate(targetId, {
//     reactions: {
//       like: states[0] && states[0].like,
//       love: states[0] && states[0].love,
//       care: states[0] && states[0].care,
//       laugh: states[0] && states[0].laugh,
//       wow: states[0] && states[0].wow,
//       sad: states[0] && states[0].sad,
//       angry: states[0] && states[0].angry,
//     },
//   });
// };

// reactionSchema.post("save", async function () {
//   // Calculate current reaction
//   await this.constructor.calculateReaction(this.targetId, this.targetType);
// });

// reactionSchema.pre(/^findOneAnd/, async function (next) {
//   this.doc = await this.findOne();
//   next();
// });

// reactionSchema.post(/^findOneAnd/, async function (next) {
//   await this.doc.constructor.calculateReaction(
//     this.doc.targetId,
//     this.doc.targetType
//   );
// });

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
