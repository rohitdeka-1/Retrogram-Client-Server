import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { editProfile, followOrUnfollow, getProfile, suggestedUsers } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

const userRoute = express.Router();

userRoute.get("/:id/profile",verifyToken,getProfile)
userRoute.post("/profile/edit",verifyToken,upload.single('profilePhoto'),editProfile);
userRoute.get("/suggested",verifyToken,suggestedUsers)
userRoute.post("/followorunfollow/:id",verifyToken,followOrUnfollow)

export default userRoute;