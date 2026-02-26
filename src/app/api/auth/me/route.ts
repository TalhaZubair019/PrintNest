import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, UserModel } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env";

const ADMIN_EMAIL = process.env.EMAIL_USER; 

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }
    
    await connectDB();
    const user = await UserModel.findOne({ id: userId }).lean() as any;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    const { password, ...userWithoutPassword } = user;
    const isAdmin = user.email === ADMIN_EMAIL || !!user.isAdmin;

    return NextResponse.json({ 
      user: { ...userWithoutPassword, isAdmin } 
    });

  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const allowedFields = ['name', 'phone', 'address', 'city', 'country', 'savedCards', 'cart', 'wishlist'];
    const updateData: any = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updateData[field] = body[field];
        }
    }
    
    await connectDB();
    const updatedUser = await UserModel.findOneAndUpdate({ id: userId }, updateData, { returnDocument: "after" }).lean();
    
    if (updatedUser) {
      return NextResponse.json({ message: "User updated successfully" });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}
