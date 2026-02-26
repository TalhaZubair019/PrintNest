import mongoose, { Schema, models } from 'mongoose';


delete (models as any).User;

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
  savedCards: { type: Array, default: [] },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;