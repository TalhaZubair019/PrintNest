import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, UserModel } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env";


export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as { isAdmin?: boolean; email?: string };
    if (!decoded.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    await connectDB();

    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      cart: [],
      wishlist: [],
      savedCards: [],
    });

    return NextResponse.json({ message: "Admin account created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
