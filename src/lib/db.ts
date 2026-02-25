import mongoose from 'mongoose';
import UserModel from './models/User';
import ProductModel from './models/Product';
import OrderModel from './models/Order';
import ReviewModel from './models/Review';
import { MONGODB_URI } from './env';

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

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
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

export { UserModel, ProductModel, OrderModel, ReviewModel };
