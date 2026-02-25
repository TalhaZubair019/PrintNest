import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  cart: { type: Array, default: [] },
  wishlist: { type: Array, default: [] },
  savedCards: { type: Array, default: [] }
}, { timestamps: true });

const User = models.User || mongoose.model('User', userSchema);
export default User;