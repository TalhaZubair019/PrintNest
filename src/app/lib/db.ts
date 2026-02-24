import mongoose from 'mongoose';
import UserModel from './models/User';
import ProductModel from './models/Product';
import OrderModel from './models/Order';
import ReviewModel from './models/Review';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB Connected");
      return mongooseInstance;
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

export interface Product {
  id: number;
  title: string;
  price: string;
  oldPrice?: string | null;
  image: string;
  badge?: string | null;
  printText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  id: string;
  productId: number;
  userId?: string;
  userName?: string;
  userImage?: string;
  rating: number;
  comment?: string;
  date?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getUsers(): Promise<User[]> {
  await connectDB();
  return await UserModel.find({}).lean<User[]>();
}

export async function addUser(user: User): Promise<void> {
  await connectDB();
  user.cart = [];
  user.wishlist = [];
  await UserModel.create(user);
}

export async function updateUser(userId: string, data: Partial<User>): Promise<boolean> {
  await connectDB();
  const updated = await UserModel.findOneAndUpdate(
    { id: userId }, 
    data, 
    { returnDocument: 'after' }
  ).lean<User>();
  return !!updated;
}

export async function deleteUser(userId: string): Promise<boolean> {
  await connectDB();
  const deleted = await UserModel.findOneAndDelete({ id: userId });
  return !!deleted;
}

export async function getOrders(userId: string): Promise<Order[]> {
  await connectDB();
  return await OrderModel.find({ userId }).lean<Order[]>();
}

export async function addOrder(order: Order): Promise<void> {
  await connectDB();
  await OrderModel.create(order);
}

export async function getAllOrders(): Promise<Order[]> {
  await connectDB();
  return await OrderModel.find({}).lean<Order[]>();
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
  await connectDB();
  const updated = await OrderModel.findOneAndUpdate(
    { id: orderId }, 
    { status }, 
    { returnDocument: 'after' }
  ).lean<Order>();
  return updated;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  await connectDB();
  const deleted = await OrderModel.findOneAndDelete({ id: orderId });
  return !!deleted;
}

export async function getProducts(): Promise<Product[]> {
  await connectDB();
  return await ProductModel.find({}).sort({ id: -1 }).lean<Product[]>();
}

export async function addProduct(product: Partial<Product>): Promise<Product> {
  await connectDB();
  const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean<Product>();
  const newId = lastProduct && typeof lastProduct.id === 'number' ? lastProduct.id + 1 : 1;
  
  const newProduct = { ...product, id: newId };
  const savedProduct = await ProductModel.create(newProduct);
  return savedProduct.toObject();
}

export async function updateProduct(productId: number, data: Partial<Product>): Promise<Product | null> {
  await connectDB();
  const updated = await ProductModel.findOneAndUpdate(
    { id: productId }, 
    data, 
    { returnDocument: 'after' }
  ).lean<Product>();
  return updated;
}

export async function deleteProductRecord(productId: number): Promise<boolean> {
  await connectDB();
  const deleted = await ProductModel.findOneAndDelete({ id: productId });
  return !!deleted;
}

export async function getReviews(): Promise<Review[]> {
  await connectDB();
  return await ReviewModel.find({}).sort({ createdAt: -1 }).lean<Review[]>();
}

export async function addReview(review: Review): Promise<Review> {
  await connectDB();
  const newReview = await ReviewModel.create(review);
  return newReview.toObject();
}

export async function updateReviewById(id: string, data: Partial<Review>): Promise<Review | null> {
  await connectDB();
  const updated = await ReviewModel.findOneAndUpdate(
    { id: id }, 
    data, 
    { returnDocument: 'after' }
  ).lean<Review>();
  return updated;
}

export async function deleteReviewById(id: string): Promise<boolean> {
  await connectDB();
  const deleted = await ReviewModel.findOneAndDelete({ id: id });
  return !!deleted;
}
