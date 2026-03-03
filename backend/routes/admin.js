const express = require("express");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const { connectDB } = require("../lib/db");
const {
  UserModel,
  OrderModel,
  ProductModel,
  ReviewModel,
  CategoryModel,
} = require("../lib/models");
const { requireAdmin } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const router = express.Router();
const ADMIN_EMAIL = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
  host: "142.251.127.108",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false, servername: "smtp.gmail.com" },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

router.get("/stats", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const [users, orders, products, reviews, categories] = await Promise.all([
      UserModel.find({}).lean(),
      OrderModel.find({}).lean(),
      ProductModel.find({}).lean(),
      ReviewModel.find({}).lean(),
      CategoryModel.find({}).sort({ name: 1 }).lean(),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    const { startDate: startDateParam, endDate: endDateParam } = req.query;
    let rangeStart, rangeEnd;
    if (startDateParam && endDateParam) {
      rangeStart = new Date(startDateParam);
      rangeEnd = new Date(endDateParam);
      rangeEnd.setHours(23, 59, 59, 999);
    } else {
      rangeEnd = new Date();
      rangeStart = new Date();
      rangeStart.setDate(rangeStart.getDate() - 6);
    }

    const dayRange = [];
    const cursor = new Date(rangeStart);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= rangeEnd) {
      dayRange.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const revenueData = dayRange.map((d) => ({
      date: d.toISOString(),
      revenue: orders
        .filter((o) => {
          const od = new Date(o.date);
          return (
            od.getDate() === d.getDate() &&
            od.getMonth() === d.getMonth() &&
            od.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, o) => sum + (o.total || 0), 0),
    }));

    const productSales = {};
    orders.forEach((order) =>
      order.items?.forEach((item) => {
        if (!productSales[item.name])
          productSales[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            image: item.image,
          };
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.totalPrice;
      }),
    );
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((order) => {
        const customer = users.find((u) => u.id === order.userId);
        return {
          ...order,
          customer: customer
            ? {
                name: customer.name,
                email: customer.email,
                address: customer.address,
                city: customer.city,
              }
            : null,
        };
      });

    const usersWithDetails = users.map((user) => {
      const { password, ...rest } = user;
      return {
        ...rest,
        isAdmin: !!user.isAdmin || user.email === ADMIN_EMAIL,
        cartCount: user.cart?.length || 0,
        wishlistCount: user.wishlist?.length || 0,
      };
    });

    const categorySales = {};
    const hourCounts = {};
    for (let i = 0; i < 24; i++)
      hourCounts[i.toString().padStart(2, "0") + ":00"] = 0;
    orders.forEach((order) => {
      const hour =
        new Date(order.date).getHours().toString().padStart(2, "0") + ":00";
      if (hourCounts[hour] !== undefined) hourCounts[hour]++;
      order.items?.forEach((item) => {
        const cat =
          products.find((p) => p.title === item.name)?.badge || "General";
        categorySales[cat] = (categorySales[cat] || 0) + (item.totalPrice || 0);
      });
    });

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating]++;
    });

    const reviewCounts = {};
    reviews.forEach((r) => {
      reviewCounts[r.productId] = (reviewCounts[r.productId] || 0) + 1;
    });
    const topReviewedProducts = Object.entries(reviewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, count]) => {
        const p = products.find((p) => p.id === parseInt(productId));
        return {
          name: p?.title || `Product ${productId}`,
          image: p?.image || "",
          count,
        };
      });

    const sentimentMap = {};
    reviews.forEach((r) => {
      if (!sentimentMap[r.productId])
        sentimentMap[r.productId] = { good: 0, bad: 0, neutral: 0 };
      if (r.rating >= 4) sentimentMap[r.productId].good++;
      else if (r.rating <= 2) sentimentMap[r.productId].bad++;
      else sentimentMap[r.productId].neutral++;
    });
    const productSentiment = Object.entries(sentimentMap)
      .map(([pid, counts]) => {
        const p = products.find((p) => p.id === parseInt(pid));
        return {
          name: p?.title || `Product ${pid}`,
          image: p?.image || "",
          ...counts,
          total: counts.good + counts.bad + counts.neutral,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return res.json({
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue,
      recentOrders,
      users: usersWithDetails,
      revenueData,
      topProducts,
      products,
      ratingDistribution,
      topReviewedProducts,
      totalReviews: reviews.length,
      productSentiment,
      reviews,
      categorySalesData: Object.entries(categorySales)
        .map(([c, v]) => ({ category: c, value: v }))
        .sort((a, b) => b.value - a.value),
      orderVelocityData: Object.entries(hourCounts).map(([h, c]) => ({
        hour: h,
        count: c,
      })),
      categories,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
    const newId =
      lastProduct && typeof lastProduct.id === "number"
        ? lastProduct.id + 1
        : 1;
    const newProduct = await ProductModel.create({ ...req.body, id: newId });
    return res.json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/products/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const product = await ProductModel.findOne({
      id: Number(req.params.id),
    }).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const updated = await ProductModel.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { returnDocument: "after" },
    ).lean();
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product updated", product: updated });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await ProductModel.findOneAndDelete({
      id: Number(req.params.id),
    });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/orders/:id", requireAdmin, async (req, res) => {
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

router.delete("/orders/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await OrderModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/categories", requireAdmin, async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name?.trim())
      return res.status(400).json({ message: "Category name is required" });

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    await connectDB();
    const existing = await CategoryModel.findOne({ slug });
    if (existing)
      return res.status(409).json({ message: "Category already exists" });

    const category = await CategoryModel.create({
      name: name.trim(),
      slug,
      image: image || null,
    });
    return res.status(201).json({ message: "Category created", category });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { name, image } = req.body;
    const updateData = {};
    if (name?.trim()) {
      updateData.name = name.trim();
      updateData.slug = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    if (image !== undefined) updateData.image = image || null;

    await connectDB();
    const updated = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Category not found" });
    return res.json({ message: "Category updated", category: updated });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/categories/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });
    return res.json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/users", requireAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });

    await connectDB();
    const existing = await UserModel.findOne({ email }).lean();
    if (existing)
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      cart: [],
      wishlist: [],
      savedCards: [],
    });
    return res
      .status(201)
      .json({ message: "Admin account created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/users/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const updated = await UserModel.findOneAndUpdate(
      { id: req.params.id },
      { isAdmin: req.body.isAdmin },
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await UserModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/ai-description", async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey)
      return res.status(500).json({ error: "GROQ_API_KEY is not configured." });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: `Write an SEO-friendly, compelling product description (2-3 sentences) for an e-commerce product titled: "${title}"${category ? ` in the category: "${category}"` : ""}. Focus on quality, appeal, and key benefits. Do not use bullet points. Return only the description text.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message ?? "Failed to generate description.";
      return res.status(response.status).json({ error: message });
    }

    const description = data?.choices?.[0]?.message?.content?.trim();
    if (!description)
      return res.status(500).json({ error: "No description returned." });
    return res.json({ description });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate description." });
  }
});

module.exports = router;
