import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUsers } from "@/app/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const users = await getUsers();
    const user = users.find((u) => u.email === email);
    if (!user || !user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name }, 
      SECRET_KEY!, 
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
