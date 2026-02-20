import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { addProduct } from "@/app/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY!) as { email: string };
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const newProduct = await addProduct(data);

    return NextResponse.json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Add product error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
