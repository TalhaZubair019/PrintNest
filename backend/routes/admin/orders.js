const express = require("express");
const { connectDB } = require("../../lib/db");
const { OrderModel } = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");
const { transporter } = require("../../lib/mailer");

const router = express.Router();

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await connectDB();
    const order = await OrderModel.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { returnDocument: "after" },
    ).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    try {
      const statusColor =
        status === "Accepted"
          ? "#10b981"
          : status === "Cancelled"
            ? "#ef4444"
            : "#f59e0b";
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
            .status-card { background: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb; text-align: center; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-weight: 700; font-size: 14px; text-transform: uppercase; color: #ffffff; background-color: ${statusColor}; margin-top: 12px; }
            .order-id { font-size: 14px; color: #6b7280; margin-bottom: 4px; }
            .section-title { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 32px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .items-table th { text-align: left; padding: 12px; background: #f9fafb; font-size: 13px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; }
            .items-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 15px; text-align: left; }
            .total-row td { padding: 20px 12px; font-weight: 700; font-size: 18px; color: #4f46e5; border-top: 2px solid #f3f4f6; }
            .footer { padding: 24px; text-align: center; background: #f9fafb; color: #9ca3af; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Update</h1>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Hello,</p>
              <p style="font-size: 16px; color: #4b5563;">Your order status has been updated. Here are the latest details:</p>
              
              <div class="status-card">
                <div class="order-id">Order ID: #${order.id.slice(-8).toUpperCase()}</div>
                <div style="font-size: 18px; font-weight: 600; color: #111827;">New Status</div>
                <div class="status-badge">${status}</div>
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
                  ${(order.items || [])
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
                    <td style="text-align: right;">$${Number(order.total || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 32px;">Thank you for shopping with PrintNest!</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PrintNest. All rights reserved.
            </div>
          </div>
        </body>
        </html>`;
      transporter
        .sendMail({
          from: `"PrintNest" <${process.env.EMAIL_USER}>`,
          to: order.customer?.email,
          subject: `Order Status Update - ${status}`,
          html: emailHtml,
        })
        .catch((e) => console.error("Email error:", e));
    } catch (_) {}

    return res.json({ message: "Order status updated", order });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await OrderModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
