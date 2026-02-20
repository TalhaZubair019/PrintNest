import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { deleteUser } from "@/app/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;
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

    const decoded = jwt.verify(token, SECRET_KEY!) as { email: string };
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const success = await deleteUser(id);

    if (success) {
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
