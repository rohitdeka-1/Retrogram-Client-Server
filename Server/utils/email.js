import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email, fullName, userId) => {
  const verificationToken = jwt.sign(
    { userId },
    process.env.EMAIL_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

    transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<h2>Welcome ${fullName}!</h2>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>`,
  });
};
