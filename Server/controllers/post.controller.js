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

    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`  
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
        caption,
        image: cloudResponse.secure_url,
        author: author
    })

    const user = await User.findById(author);
    if(user){
        User.post.push(post._id);
        await User.save();
    }

    await post.populate({path: 'author',select:'-password'});
    return res.status(201).json({
        success: true,
        message: "New Post Added",
        post,
    })

  } catch (err) {
    console.log("Error adding post : ", err);
  }
};
