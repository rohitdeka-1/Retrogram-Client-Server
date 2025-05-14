import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId).select("-password");

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!userId) {
      console.log("User not found");
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User fetched",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error while fetching user", error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePhoto = req.file;

    let cloudResponse = null;

    if (profilePhoto) {
      const fileUri = getDataUri(profilePhoto);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePhoto) user.profilePhoto = cloudResponse.secure_url;

    await user.save();

    return res.status(201).json({
      message: "User updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("error :", error);
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently no Users",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      suggestedUsers,
    });
  } catch (error) {}
};

export const followOrUnfollow = async (req, res) => {
  try {
    const me = req.id;
    const toFollow = req.params.id;

    if (me === toFollow) {
      return res.status(400).json({
        success: false,
        message: "Cannot self follow",
      });
    }

    const user = await User.findById(me);
    const targetUser = await User.findById(toFollow);

    if (!user || !targetUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!targetUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = user.following.includes(toFollow);

    if (isFollowing) {
      // UNFOLLOW
      await Promise.all([
        User.updateOne({ _id: me }, { $pull: { following: toFollow } }),
        User.updateOne({ _id: toFollow }, { $pull: { followers: me } }),
      ]);
      return res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
      });
    } else {
      // FOLLOW
      await Promise.all([
        User.updateOne({ _id: me }, { $addToSet: { following: toFollow } }),
        User.updateOne({ _id: toFollow }, { $addToSet: { followers: me } }),
      ]);
      return res.status(200).json({
        success: true,
        message: "Followed successfully",
      });
    }
  } catch (error) {
    console.error("Error Following/Unfollowing", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
