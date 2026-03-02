import mongoose, { Schema, models } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: null },
}, { timestamps: true });

const Category = models.Category || mongoose.model('Category', categorySchema);
export default Category;
