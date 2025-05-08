// routes/similarDestinations.js
import express from "express";
import Destination from "../models/Destinations.js";

const router = express.Router();

function calculateSimilarityScore(base, candidate) {
  let score = 0;

  if (base.Category && candidate.Category) {
    const common = base.Category.filter(cat => candidate.Category.includes(cat));
    if (common.length) score += 10;
  }
  if (base.Activities && candidate.Activities) {
    const common = base.Activities.filter(act => candidate.Activities.includes(act));
    score += common.length;
  }
  if (base.Seasons && candidate.Seasons) {
    const common = base.Seasons.filter(season => candidate.Seasons.includes(season));
    score += common.length;
  }
  const basePrice = (base.Min_Price + base.Max_Price) / 2;
  const compPrice = (candidate.Min_Price + candidate.Max_Price) / 2;
  if (Math.abs(basePrice - compPrice) <= 200) score += 5;
  return score;
}

router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const baseDestination = await Destination.findById(id);
    if (!baseDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const allDestinations = await Destination.find();
    const scored = [];

    allDestinations.forEach(dest => {
      if (dest._id.toString() === id) return; 
      const score = calculateSimilarityScore(baseDestination, dest);
      scored.push({ destination: dest, score });
    });

    scored.sort((a, b) => b.score - a.score);
    const topSimilar = scored.slice(0, 5).map(({ destination }) => ({
      _id: destination._id,
      id: destination.id,
      Loc_name: destination.Loc_name,
      Image: destination.Image,
      Activities: destination.Activities,
      State: destination.State,
      Min_Price: destination.Min_Price,
      Max_Price: destination.Max_Price,
    }));

    res.json(topSimilar);
  } catch (err) {
    console.error("Error fetching similar destinations:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

  
export default router;
