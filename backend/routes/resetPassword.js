// backend/routes/resetPassword.js

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const router = express.Router();

// POST route to reset the password
router.post('/resetPassword', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_RESET_PASS);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user not found.' });
    }

    // Update the user's password (raw) — the pre('save') hook will hash it
      user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Invalid or expired token.' });
  }
});

export default router;
