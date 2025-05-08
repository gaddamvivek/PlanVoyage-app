import express from 'express';
import Destination from "../models/Destinations.js";
import UserPreference from '../models/userPreferences.js';

const router = express.Router();

const getUserPreferences = async (email, preferenceType) => {
  const preferences = await UserPreference.find({ email, preference: preferenceType });
  const placeIds = preferences.map(p => p.placeId);
  return await Destination.find({ id: { $in: placeIds } });
};

// Update user preference
const updatePreference = async (req, res) => {
  try {
    const { email, placeId, preference } = req.body;
    
    // Remove any existing preference for this place
    await UserPreference.findOneAndDelete({ email, placeId });
    
    // If preference is not 'none', add the new preference
    if (preference !== 'none') {
      await UserPreference.create({ email, placeId, preference });
    }
    
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set preference (like/dislike/none)
router.post('/set-preference', updatePreference);

// Get liked places
router.get('/liked-places', async (req, res) => {
  try {
    const { email } = req.query;
    const likedPlaces = await getUserPreferences(email, 'like');
    res.status(200).json({ likedPlaces });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get disliked places
router.get('/disliked-places', async (req, res) => {
  try {
    const { email } = req.query;
    const dislikedPlaces = await getUserPreferences(email, 'dislike');
    res.status(200).json({ dislikedPlaces });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;