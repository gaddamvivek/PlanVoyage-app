import express from "express";
import { recommendDestinations } from "./recommendDestinations.js"; // this imports your function

const router = express.Router();

router.get("/recommendDestinations", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const recommendations = await recommendDestinations(email);
    res.json(recommendations);
  } catch (error) {
    console.error('Error recommending destinations:', error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
