import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, UserModel } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env";

const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as { email: string };
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const deletedUser = await UserModel.findOneAndDelete({ id });

    if (deletedUser) {
      return NextResponse.json({ message: "User deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 },
    );
  }
}
