const express = require("express");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../../lib/db");
const { OrderModel, UserModel, ProductModel } = require("../../lib/models");
const { requireAuth, JWT_SECRET } = require("../../middleware/auth");
const { transporter } = require("../../lib/mailer");
const db = require("../../../data/db.json");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const orders = await OrderModel.find({ userId: req.user.id }).lean();
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.post("/place-order", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    await connectDB();
    const shopProducts = await ProductModel.find({}).lean();
    const dbProducts = db.products?.products || [];
    const allValidProducts = [...shopProducts, ...dbProducts];
    const validProductIds = allValidProducts.map((p) => p.id);

    for (const item of items) {
      if (!validProductIds.includes(item.id)) {
        return res.status(400).json({
          error: `Product "${item.name}" is no longer available. Please remove it from your cart.`,
        });
      }
    }

    let userId = "guest";
    const authHeader = req.headers["authorization"];
    const cookieHeader = req.headers["cookie"] || "";
    const cookieMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
    const token =
      (authHeader || "").replace("Bearer ", "") ||
      (cookieMatch ? cookieMatch[1] : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (_) {}
    }

    const orderId = Date.now().toString();
    const newOrder = {
      id: orderId,
      userId,
      date: new Date().toLocaleString(),
      status: "Pending",
      total: totalAmount,
      items,
      customer,
    };

    await connectDB();
    await OrderModel.create(newOrder);
    if (userId !== "guest") {
      await UserModel.findOneAndUpdate({ id: userId }, { cart: [] });
    }

    try {
      console.log(
        `Generating confirmation email for order ${orderId}. Items:`,
        items.length,
      );
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; }
            .content { padding: 32px; }
            .order-meta { background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e5e7eb; }
            .order-meta p { margin: 4px 0; font-size: 14px; color: #4b5563; }
            .order-meta strong { color: #111827; }
            .section-title { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; }
            .customer-info { margin-bottom: 24px; font-size: 15px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .items-table th { text-align: left; padding: 12px; background: #f9fafb; font-size: 13px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; }
            .items-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 15px; }
            .total-row td { padding: 20px 12px; font-weight: 700; font-size: 18px; color: #4f46e5; border-top: 2px solid #f3f4f6; }
            .footer { padding: 24px; text-align: center; background: #f9fafb; color: #9ca3af; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
            </div>
            <div class="content">
              <div class="order-meta">
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Date:</strong> ${newOrder.date}</p>
                <p><strong>Payment Method:</strong> ${customer.paymentMethod?.toUpperCase()}</p>
              </div>
              
              <div class="section-title">Shipping Details</div>
              <div class="customer-info">
                <p><strong>${customer.firstName} ${customer.lastName}</strong><br>
                ${customer.email} | ${customer.phone}<br>
                ${customer.address}${customer.apartment ? `, ${customer.apartment}` : ""}<br>
                ${customer.city}, ${customer.postcode}</p>
              </div>

              <div class="section-title">Order Summary</div>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map((i) => {
                      const price = Number(i.price) || 0;
                      const qty = Number(i.quantity) || 1;
                      return `
                    <tr>
                      <td>${i.name || "Product"}</td>
                      <td style="text-align: right;">$${price.toFixed(2)}</td>
                      <td style="text-align: center;">${qty}</td>
                      <td style="text-align: right;">$${(price * qty).toFixed(2)}</td>
                    </tr>
                  `;
                    })
                    .join("")}
                </tbody>
                <tfoot>
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">Grand Total:</td>
                    <td style="text-align: right;">$${Number(totalAmount).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <p style="text-align: center; color: #6b7280; font-size: 14px;">Thank you for choosing PrintNest!</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PrintNest. All rights reserved.
            </div>
          </div>
        </body>
        </html>`;

      console.log(`Sending email to ${customer.email} and admin...`);
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
      ])
        .then(() => console.log("Emails sent successfully."))
        .catch((e) => console.error("Email error:", e));
    } catch (e) {
      console.error("Critical error generating email HTML:", e);
    }

    return res.json({ message: "Order placed successfully!", orderId });
  } catch (error) {
    console.error("Place order failed:", error);
    return res.status(500).json({ error: "Failed to place order." });
  }
});

module.exports = router;
