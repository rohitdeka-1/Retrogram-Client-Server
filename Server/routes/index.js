import express, { Router } from "express";
import authRoute from "./auth.routes.js";
import userRoute from "./user.routes.js";

const router = express.Router();

router.use("/auth",authRoute)
router.use("/user",userRoute)

export default router;