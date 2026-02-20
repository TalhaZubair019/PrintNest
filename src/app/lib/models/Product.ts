import mongoose, { Schema, models } from 'mongoose';

const productSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  oldPrice: { type: String, default: null },
  image: { type: String, required: true },
  badge: { type: String, default: null },
  printText: { type: String, default: "We print with" }
}, { timestamps: true });

const Product = models.Product || mongoose.model('Product', productSchema);
export default Product;