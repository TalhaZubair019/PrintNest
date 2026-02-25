import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, UserModel } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env";

const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();
    const user = await UserModel.findOne({ email }).lean() as any;
    
    if (!user || !user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name }, 
      JWT_SECRET!, 
      { expiresIn: "1h" }
    );

    (await cookies()).set("token", token, { 
      httpOnly: true, 
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 
    });
    const { password: _, ...userWithoutPassword } = user;
    const isAdmin = user.email === ADMIN_EMAIL;
    return NextResponse.json({ 
      token, 
      user: { ...userWithoutPassword, isAdmin }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

