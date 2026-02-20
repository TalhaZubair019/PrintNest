import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { updateOrderStatus, deleteOrder } from "@/app/lib/db";
import nodemailer from "nodemailer";

const SECRET_KEY = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function PATCH(
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
    const { status } = await req.json();

    const order = await updateOrderStatus(id, status);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    try {
      const statusColor =
        status === "Accepted"
          ? "#10b981"
          : status === "Cancelled"
            ? "#ef4444"
            : "#f59e0b";

      const emailHtml = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Order Status Update</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Your order status has been updated:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id.slice(-8).toUpperCase()}</p>
              <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
              <p style="margin: 5px 0;"><strong>Order:</strong> <span style="color: #6b7280;">${order.items.map((item: any) => `${item.name} (${item.price})`).join(", ")}</span></p>
              <p style="margin: 5px 0;"><strong>Order Total:</strong> ${order.total}</p>
            </div>
            ${
              status === "Accepted"
                ? '<p style="color: #10b981; font-weight: bold;">✓ Your order has been accepted and is being processed!</p>'
                : status === "Cancelled"
                  ? '<p style="color: #ef4444; font-weight: bold;">✗ Your order has been cancelled. If you have any questions, please contact support.</p>'
                  : '<p>Your order status has been updated. We will keep you informed of any changes.</p>'
            }
            <p style="margin-top: 30px; color: #6b7280;">Thank you for shopping with us!</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"PrintNest" <${process.env.EMAIL_USER}>`,
        to: order.customer.email,
        subject: `Order Status Update - ${status}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 },
    );
  }
}

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
    const deleted = await deleteOrder(id);

    if (!deleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 },
    );
  }
}
