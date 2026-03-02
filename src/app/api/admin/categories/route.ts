import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, CategoryModel } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env";

const ADMIN_EMAIL = process.env.EMAIL_USER;

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { email: string; isAdmin?: boolean };
    if (decoded.email !== ADMIN_EMAIL && !decoded.isAdmin) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, image } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    await connectDB();
    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 });
    }

    const category = await CategoryModel.create({ name: name.trim(), slug, image: image || null });
    return NextResponse.json({ message: "Category created", category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
