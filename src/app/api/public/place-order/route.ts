import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, OrderModel, UserModel } from "@/app/lib/db";
import { JWT_SECRET } from "@/app/lib/env";
const transporter = nodemailer.createTransport({
  host: "142.251.127.108", 
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    servername: "smtp.gmail.com",
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

export async function POST(req: Request) {
  try {
    const { customer, items, totalAmount } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = "guest"; 

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { id: string };
        userId = decoded.id;
      } catch (error) {
      }
    }
    const orderId = Date.now().toString();
    const newOrder = {
      id: orderId,
      userId: userId,
      date: new Date().toLocaleString(),
      status: "Pending",
      total: totalAmount,
      items: items,
      customer: customer, 
    };
    await connectDB();
    await OrderModel.create(newOrder);
    if (userId !== "guest") {
      await UserModel.findOneAndUpdate({ id: userId }, { cart: [] });
    } 
    try {
      const emailHtml = `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order #${orderId}</h2>
            <p><strong>Date:</strong> ${newOrder.date}</p>
            <p><strong>Payment Method:</strong> ${customer.paymentMethod.toUpperCase()}</p>
            <h3 style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">Customer Details</h3>
            <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p>
              ${customer.address} ${customer.apartment ? `, ${customer.apartment}` : ""}<br>
              ${customer.city}, ${customer.province} ${customer.postcode}
            </p>
            <h3 style="margin-top: 20px;">Order Summary</h3>
            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #2563eb; color: #ffffff;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item: any) => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;"><strong>${item.name}</strong></td>
                    <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>`).join("")}
              </tbody>
              <tfoot>
                <tr style="font-size: 18px; color: #2563eb;">
                  <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: bold;">$${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
      `;

      Promise.all([
        transporter.sendMail({
          from: `"Store Orders" ${process.env.EMAIL_USER}`,
          to: process.env.EMAIL_USER,
          replyTo: customer.email,
          subject: `New Order #${orderId} from ${customer.firstName}`,
          html: emailHtml,
        }),
        transporter.sendMail({
          from: `"Store Orders" ${process.env.EMAIL_USER}`,
          to: customer.email,
          subject: `Order Confirmation #${orderId}`,
          html: emailHtml,
        }),
      ]).catch((emailError) => {
         console.error("Email failed to send in background:", emailError);
      });

    } catch (emailError) {
       console.error("Email setup failed", emailError);
    }

    return NextResponse.json(
      { message: "Order placed successfully!", orderId },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to place order." },
      { status: 500 }
    );
  }
}