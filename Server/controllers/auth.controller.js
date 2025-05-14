import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/email.js";
dotenv.config();

/**
 * @swagger
 * /auth/register:
 *   post:                                                       
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request

*/

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      if (!existedUser.isVerified) {
        await sendVerificationEmail(email, fullName, existedUser._id);
        return res.status(200).json({
          success: true,
          message:
            "Verification email resent. Please verify your email to log in.",
        });
      }

      return res.status(400).json({
        message:
          existedUser.email === email
            ? "User already exists"
            : "Username is already taken",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    await sendVerificationEmail(email, fullName, newUser._id);

    return res.status(201).json({
      success: true,
      message: "User created. Please verify your email to log in.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 alreadyVerified:
 *                   type: boolean
 *                   description: Indicates if the email was already verified
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified.",
      });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      alreadyVerified: false,
      message: "Email verified successfully!",
    });
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identity:
 *                 type: string
 *                 description: Username or email of the user
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 securedUser:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     profilePhoto:
 *                       type: string
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: string
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

export const login = async (req, res) => {
  try {
    const { identity, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: identity }, { email: identity }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if(!user.isVerified){
      return res.status(401).json({
        success: false,
        message: "User not verified"
      })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const securedUser = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
    };

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome ${user.username}`,
        securedUser,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */

export const logout = async (_, res) => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
      })
      .status(200)
      .json({
        message: "Logged Out",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};
