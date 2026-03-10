const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../lib/db");
const { UserModel } = require("../lib/models");
const { requireAuth, JWT_SECRET, ADMIN_EMAIL } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await connectDB();
    const user = await UserModel.findOne({ email }).lean();

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isAdmin = user.email === ADMIN_EMAIL || !!user.isAdmin;
    const adminRole =
      user.email === ADMIN_EMAIL
        ? "super_admin"
        : user.isAdmin
          ? "admin"
          : null;
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, isAdmin, adminRole },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600 * 1000,
      sameSite: "lax",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      token,
      user: { ...userWithoutPassword, isAdmin, adminRole },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await connectDB();
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      cart: [],
      wishlist: [],
      savedCards: [],
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.user.id }).lean();
    if (!user) return res.status(401).json({ message: "User not found" });

    const { password, ...userWithoutPassword } = user;
    const isAdmin = user.email === ADMIN_EMAIL || !!user.isAdmin;
    const adminRole =
      user.email === ADMIN_EMAIL
        ? "super_admin"
        : user.isAdmin
          ? "admin"
          : null;
    return res.json({ user: { ...userWithoutPassword, isAdmin, adminRole } });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "address",
      "city",
      "province",
      "postcode",
      "country",
      "countryCode",
      "stateCode",
      "savedCards",
      "cart",
      "wishlist",
      "promotionPending",
      "demotionPending",
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    await connectDB();
    const updated = await UserModel.findOneAndUpdate(
      { id: req.user.id },
      updateData,
      { returnDocument: "after" },
    ).lean();
    if (updated) return res.json({ message: "User updated successfully" });
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ message: "Logged out successfully" });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await connectDB();
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return res.json({
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }
    const resetToken = jwt.sign({ id: user.id, purpose: "reset" }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const { transporter } = require("../lib/mailer");
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request - PrintNest",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
          <h2 style="color: #8B5CF6;">Password Reset</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>We received a request to reset your password for your PrintNest account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Best regards,<br />The PrintNest Team</p>
        </div>
      `,
    });

    return res.json({
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.purpose !== "reset") throw new Error("Invalid token purpose");

      await connectDB();
      const user = await UserModel.findOne({ id: decoded.id });
      if (!user) return res.status(404).json({ message: "User not found" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Password has been reset successfully." });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired reset link" });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
