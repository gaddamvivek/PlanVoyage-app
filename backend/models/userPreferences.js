import mongoose from 'mongoose';

const UserPreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true },
  placeId: { type: Number, required: true },
  preference: { type: String, enum: ['like', 'dislike'], required: true }
}, { timestamps: true });

// Create compound unique index
UserPreferenceSchema.index({ email: 1, placeId: 1 }, { unique: true });

export default mongoose.models.UserPreference || 
       mongoose.model('UserPreference', UserPreferenceSchema);