import mongoose, { Schema, models } from 'mongoose';

const orderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  total: { type: Number, required: true },
  items: { type: Array, required: true },
  customer: { type: Object }
}, { timestamps: true });

const Order = models.Order || mongoose.model('Order', orderSchema);
export default Order;
