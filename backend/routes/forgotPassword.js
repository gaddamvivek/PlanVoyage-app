import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route for forgot password (requesting password reset)
router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_RESET_PASS, { expiresIn: '20m' });

    // Construct the reset password URL
    const resetUrl = `${process.env.FRONTEND_URL}/login/resetPassword?token=${resetToken}`;

    // Send the email with the reset link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p style="color:#000000;">We received a request to reset your password. This link will expire in 20 minutes. Please click the link below to proceed:</p>
             <p><a href="${resetUrl}" style="color:#0056b3;text-decoration:underline;">Reset Your Password</a></p>
             <p style="color:#000000;">If you did not request a password reset, you can safely ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
