const Friendship = require("../model/friendship");
const User = require("../model/user");

const friendshipController = {};

// Send a friend request
friendshipController.sendRequest = async (req, res, next) => {
  try {
    const fromId = req.userId;
    const toId = req.params.id;

    const targetUser = await User.findById(toId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    let friendship = await Friendship.findOne({
      $or: [
        { from: fromId, to: toId },
        { from: toId, to: fromId },
      ],
    });

    if (!friendship) {
      await Friendship.create({
        from: fromId,
        to: toId,
        status: "Requesting",
      });
    } else {
      switch (friendship.status) {
        case "Requesting":
          if (friendship.from.equals(fromId)) {
            throw new Error("You have already sent a request to this user");
          } else {
            throw new Error("You have received a request from this user");
          }
        case "Accepted":
          throw new Error("Users are already friend");
        case "Cancel":
        case "Decline":
        case "Removed":
          friendship.from = fromId;
          friendship.to = toId;
          friendship.status = "Requesting";
          await friendship.save();
          break;
        default:
          break;
      }
    }

    res.status(200).json({
      success: true,
      data: friendship,
      message: "Request has ben sent",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Cancel a request
friendshipController.cancelRequest = async (req, res, next) => {
  try {
    const fromId = req.userId;
    const toId = req.params.id;

    let friendship = await Friendship.findOne({
      status: "Requesting",
      from: fromId,
      to: toId,
    });

    if (!friendship) {
      throw new Error("Request not found");
    }

    friendship.status = "Cancel";
    await friendship.save();

    res.status(200).json({
      success: true,
      data: friendship,
      message: "Friend request has been cancelled",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Accept a friend request
friendshipController.acceptRequest = async (req, res, next) => {
  try {
    const fromId = req.params.id;
    const toId = req.userId;

    let friendship = await Friendship.findOne({
      status: "Requesting",
      from: fromId,
      to: toId,
    });

    if (!friendship) {
      throw new Error("Friend Request not found");
    }

    friendship.status = "Accepted";
    await friendship.save();

    res.status(200).json({
      success: true,
      data: friendship,
      message: "Friend request has been accepted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Decline a friend request
friendshipController.declineRequest = async (req, res, next) => {
  try {
    const fromId = req.userId;
    const toId = req.params.id;

    let friendship = await Friendship.findOne({
      status: "Requesting",
      from: fromId,
      to: toId,
    });

    if (!friendship) {
      throw new Error("Request not found");
    }

    friendship.status = "Decline";
    await friendship.save();

    res.status(200).json({
      success: true,
      data: friendship,
      message: "Friend request has been declined",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Remove a friend
friendshipController.removeRequest = async (req, res, next) => {
  try {
    const fromId = req.userId;
    const toId = req.params.id;

    let friendship = await Friendship.findOneAndUpdate({
      $or: [
        { from: fromId, to: toId },
        { from: toId, to: fromId },
      ],
      status: "Accepted",
    });

    if (!friendship) {
      throw new Error("Friend not found");
    }

    friendship.status = "Removed";
    await friendship.save();

    res.status(200).json({
      success: true,
      data: friendship,
      message: "Friendship has been removed",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get the list of sent requests
friendshipController.getListOfSentRequests = async (req, res, next) => {
  try {
    const userId = req.userId;
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total friends number
    let requestList = await Friendship.find({
      $or: [{ from: userId }, { to: userId }],
      status: "Requesting",
    });

    const recipientIDs = requestList.map((friendship) => {
      if (friendship.from._id.equals(userId)) return friendship.to;
      return friendship.from;
    });

    const totalRequests = await User.countDocuments({
      ...filter,
      _id: { $in: recipientIDs },
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalRequests / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get user based on query info
    const users = await User.find({ ...filter, _id: { $in: recipientIDs } })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    // 6. Create users with friendship
    const promises = users.map(async (user) => {
      let temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    const usersWithFriendship = await Promise.all(promises);

    // 7. Send users + totalPages info
    res.status(200).json({
      success: true,
      data: { users: usersWithFriendship, totalPages },
      message: "Get list of sent request successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get the list of received requests
friendshipController.getListOfReceivedRequests = async (req, res, next) => {
  try {
    const userId = req.userId;
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total friends number
    let requestList = await Friendship.find({
      to: userId,
      status: "Requesting",
    });

    const requesterIDs = requestList.map((friendship) => {
      if (friendship.from._id.equals(userId)) return friendship.to;
      return friendship.from;
    });

    const totalRequests = await User.countDocuments({
      ...filter,
      _id: { $in: requesterIDs },
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalRequests / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get user based on query info
    const users = await User.find({ ...filter, _id: { $in: requesterIDs } })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    // 6. Create users with friendship
    const promises = users.map(async (user) => {
      let temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    const usersWithFriendship = await Promise.all(promises);

    // 7. Send users + totalPages info
    res.status(200).json({
      success: true,
      data: { users: usersWithFriendship, totalPages },
      message: "Get list of sent request successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get the list of friends
friendshipController.getListOfFriends = async (req, res, next) => {
  try {
    const userId = req.userId;
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total friends number
    let friendList = await Friendship.find({
      $or: [{ from: userId }, { to: userId }],
      status: "Accepted",
    });

    const friendIDs = friendList.map((friendship) => {
      if (friendship.from._id.equals(userId)) return friendship.to;
      return friendship.from;
    });

    const totalFriends = await User.countDocuments({
      ...filter,
      _id: { $in: friendIDs },
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalFriends / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get user based on query info
    const users = await User.find({ ...filter, _id: { $in: friendIDs } })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    // 6. Create users with friendship
    const promises = users.map(async (user) => {
      let temp = user.toJSON();
      temp.friendship = friendList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    const usersWithFriendship = await Promise.all(promises);

    // 7. Send users + totalPages info
    res.status(200).json({
      success: true,
      data: { users: usersWithFriendship, totalPages },
      message: "Get list of friends successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = friendshipController;
