import { login, logout, register, verifyEmail } from "../controllers/auth.controller.js";
import { inputValidationError, loginInputValidator, registerationInputValidator } from "../middlewares/authValidator.js";
import express from "express";

const authRoute = express.Router();

authRoute.post("/register",registerationInputValidator,inputValidationError,register);
authRoute.post("/login",loginInputValidator,inputValidationError,login);
authRoute.get("/verify-email", verifyEmail);

authRoute.post("/logout",logout);   


export default authRoute;