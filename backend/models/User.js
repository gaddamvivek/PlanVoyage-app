import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  firstname:{type: String, required: true},
  lastname:{type: String, required: true},
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  likedPlaces: [Number],
  dislikedPlaces: [Number],
  
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
