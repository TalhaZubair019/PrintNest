import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, ProductModel } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env";

const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET!) as { email: string; isAdmin?: boolean };
    if (decoded.email !== ADMIN_EMAIL && !decoded.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    await connectDB();
    const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
    const newId = lastProduct && typeof (lastProduct as any).id === 'number' ? (lastProduct as any).id + 1 : 1;
    
    const newProduct = await ProductModel.create({ ...data, id: newId });

    return NextResponse.json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Add product error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}