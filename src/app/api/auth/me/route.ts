import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUsers, updateUser } from "@/app/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.EMAIL_USER; 

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as { id: string };
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
    const users = await getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    const { password, ...userWithoutPassword } = user;
    const isAdmin = user.email === ADMIN_EMAIL;

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
    const success = await updateUser(userId, updateData);
    if (success) {
      return NextResponse.json({ message: "User updated successfully" });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}
