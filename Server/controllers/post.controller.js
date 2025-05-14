import express from "express";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const author = req.id;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // image upload
    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: author,
    });

    const user = await User.findById(author);
    if (user) {
      user.post.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      success: true,
      message: "New Post Added",
      post,
    });
  } catch (err) {
    console.log("Error adding post : ", err);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ created: -1 })
      .populate({ path: "author", select: "username, profilePhoto" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePhoto",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
      message: "All post fetched",
    });
  } catch (error) {
    console.log("Error in fetching Posts : ", error);
  }
};

export const getUserPostNumbers = async (req, res) => {
  try {
    const authorId = req.id;
    console.log(author);

    const post = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePhoto" });

    return res.status(200).json({
      posts,
      success: true,
      message: "All post fetched",
    });
  } catch (err) {
    console.log("Error in fetching numbers of posts,", err);
  }
};

export const likePost = async (req, res) => {
  try {
    const me = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    //Like logic
    await post.updateOne({ $addToSet: { likes: me } });
  } catch (err) {
    console.log("Error liking post : ", err);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const me = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    //Dislike logic
    await post.updateOne({ $pull: { likes: me } });
  } catch (err) {
    console.log("Error Disliking post : ", err);
  }
};

export const addComment = async (req, res) => {
  try {
    const me = req.id;
    const postId = req.params.id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const post = await Post.findById(postId);
    const comment = await Comment.create({
      text,
      author: me,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePhoto",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (err) {
    console.log("Error adding commenting : ", err);
  }
};

export const getAllComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username, profilePhoto",
    });

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "No Comments on this post",
      });
    }

    return res.status(200).json({
      succes: true,
      message: "Comments fetched",
      comments,
    });
  } catch (err) {
    console.log("Error fetching comments : ", err);
  }
};

export const deletePosts = async (req, res) => {
  try {
    const postId = req.params.id;
    const me = req.id;

    const post = await Post.findById(postId);
    if (post.author.toString() !== me) {
      return res.status(401).json({
        success: false,
        message: "Unaunthorized",
      });
    }

    await post.findByIdAndDelete(postId);
    const user = await User.findById(me);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    console.log("Error in deleting Posts : ", err);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const me = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(me);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked → remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "Post removed from bookmark",
          success: true,
        });
    } else {
      // bookmark krna padega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "Post removed from bookmark",
          success: true,
        });
    }
  } catch (error) {
    console.log(error);
  }
};







