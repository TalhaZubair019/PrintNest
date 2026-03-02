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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { name, image } = await req.json();

    await connectDB();
    const updateData: any = {};
    if (name?.trim()) {
      updateData.name = name.trim();
      updateData.slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    if (image !== undefined) updateData.image = image || null;

    const updated = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    return NextResponse.json({ message: "Category updated", category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const deleted = await CategoryModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
