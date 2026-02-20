import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, 
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected (Cached)");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

const UserSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false, timestamps: true });
const OrderSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false, timestamps: true });
const ProductSchema = new mongoose.Schema({ id: { type: Number, unique: true } }, { strict: false, timestamps: true });
const ReviewSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false, timestamps: true });
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export interface SavedCard {
  id: string;
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  cart?: any[];
  wishlist?: any[];
  savedCards?: SavedCard[];
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: string;
  total: number;
  items: any[];
  customer?: any;
}

export async function getUsers() {
  await connectDB();
  return await UserModel.find({}).lean();
}

export async function addUser(user: User) {
  await connectDB();
  user.cart = [];
  user.wishlist = [];
  user.savedCards = [];
  await UserModel.create(user);
}

export async function updateUser(userId: string, data: Partial<User>) {
  await connectDB();
  const updated = await UserModel.findOneAndUpdate(
    { id: userId }, 
    data, 
    { returnDocument: 'after' }
  ).lean();
  return !!updated;
}

export async function deleteUser(userId: string) {
  await connectDB();
  const deleted = await UserModel.findOneAndDelete({ id: userId });
  return !!deleted;
}

export async function getOrders(userId: string) {
  await connectDB();
  return await OrderModel.find({ userId }).lean();
}

export async function addOrder(order: Order) {
  await connectDB();
  await OrderModel.create(order);
}

export async function getAllOrders() {
  await connectDB();
  return await OrderModel.find({}).lean();
}

export async function updateOrderStatus(orderId: string, status: string) {
  await connectDB();
  const updated = await OrderModel.findOneAndUpdate(
    { id: orderId }, 
    { status }, 
    { returnDocument: 'after' }
  ).lean();
  return updated;
}

export async function deleteOrder(orderId: string) {
  await connectDB();
  const deleted = await OrderModel.findOneAndDelete({ id: orderId });
  return !!deleted;
}

export async function getProducts() {
  await connectDB();
  return await ProductModel.find({}).sort({ id: -1 }).lean();
}

export async function addProduct(product: any) {
  await connectDB();
  const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
  const newId = lastProduct && typeof (lastProduct as any).id === 'number' ? (lastProduct as any).id + 1 : 1;
  
  const newProduct = { id: newId, ...product };
  await ProductModel.create(newProduct);
  return newProduct;
}

export async function updateProduct(productId: number, data: any) {
  await connectDB();
  const updated = await ProductModel.findOneAndUpdate(
    { id: productId }, 
    data, 
    { returnDocument: 'after' }
  ).lean();
  return updated;
}

export async function deleteProductRecord(productId: number) {
  await connectDB();
  const deleted = await ProductModel.findOneAndDelete({ id: productId });
  return !!deleted;
}

export async function getReviews() {
  await connectDB();
  return await ReviewModel.find({}).sort({ createdAt: -1 }).lean();
}

export async function addReview(review: any) {
  await connectDB();
  const newReview = await ReviewModel.create(review);
  return newReview;
}

export async function updateReviewById(id: string, data: any) {
  await connectDB();
  const updated = await ReviewModel.findOneAndUpdate(
    { id: id }, 
    data, 
    { returnDocument: 'after' }
  ).lean();
  return updated;
}

export async function deleteReviewById(id: string) {
  await connectDB();
  const deleted = await ReviewModel.findOneAndDelete({ id: id });
  return !!deleted;
}