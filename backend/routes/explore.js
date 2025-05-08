import express from "express";
import Destination from "../models/Destinations.js"; 
const router = express.Router();

router.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { Category: { $regex: search, $options: "i" } },
          { Loc_name: { $regex: search, $options: "i" } },
          { State: { $regex: search, $options: "i" } },
          { Address: { $regex: search, $options: "i" } },
        ],
      };
    }

    const destinations = await Destination.find(query);
    res.json(destinations);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ error: "Server error during search" });
  }
});

export default router;