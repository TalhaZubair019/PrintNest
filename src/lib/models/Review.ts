import mongoose, { Schema, models } from 'mongoose';

const reviewSchema = new Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: Number, required: true },
  userId: { type: String },
  userName: { type: String },
  userImage: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: String }
}, { timestamps: true });

const Review = models.Review || mongoose.model('Review', reviewSchema);
export default Review;
