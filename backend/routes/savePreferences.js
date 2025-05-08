import { Router } from "express";
const router = Router();
import preferencesModel from "../models/Preferences.js";

router.post("/preferences", async (req,res) => {
    console.log(req.body);
    const { email, selectedCategories, selectedSeasons, selectedPartners, selectedActivities, budget, travelExperience } = req.body;
    const Category = selectedCategories;
    const Seasons = selectedSeasons;
    const Travel_Partner = selectedPartners;
    const Activities = selectedActivities;
    const Budget = budget;
    const Travel_experience = travelExperience;
    try{
       const preferences = new preferencesModel({email,Category,Seasons,Travel_Partner,Activities,Budget,Travel_experience});
       await preferences.save();
      res.status(200).json({
        message: "Preferences saved ",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

export default router;