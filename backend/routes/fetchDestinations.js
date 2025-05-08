import { Router } from "express";
const router = Router();
import destinationModel from "../models/Destinations.js";
import preferencesModel from "../models/Preferences.js";

router.get("/destinations", async (req, res) => {
  const { email, category } = req.query;

  try {
    if (category) {
      const destinations = await destinationModel.find({
        Category: { $regex: new RegExp(`^${category}$`, "i") }
      });
      return res.status(200).json(destinations);
    }
    
    if (email) {
      // Logged-in user with preferences
      const preferences = await preferencesModel.findOne({ email });
      console.log(preferences);
      if (!preferences) {
        return res.status(404).json({ message: "No preferences found for this email" });
      }

      const {
        Category = [],
        Seasons = [],
        Travel_Partner = [],
        Activities = [],
      } = preferences;
      const userBudget = parseFloat(preferences.Budget) || 100000;

      const query = {};

      if (Category.length > 0) query.Category = { $in: Category };
      if (Seasons.length > 0) query.Seasons = { $in: Seasons };
      if (Travel_Partner.length > 0) query.Travel_Partner = { $in: Travel_Partner };
      if (Activities.length > 0) query.Activities = { $in: Activities };

      query.$expr = {
        $lte: [
          { $divide: [{ $add: ['$Min_Price', '$Max_Price'] }, 2] },
          userBudget
        ]
      };

      const matchingDestinations = await destinationModel.find(query);
      return res.status(200).json(matchingDestinations);
    } 
     else {
      // Not logged in — return all destinations
      const destinations = await destinationModel.find();
      return res.status(200).json(destinations);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/destinations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await destinationModel.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
