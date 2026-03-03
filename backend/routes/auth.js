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
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, isAdmin },
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
    return res.json({ token, user: { ...userWithoutPassword, isAdmin } });
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
    return res.json({ user: { ...userWithoutPassword, isAdmin } });
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
      "savedCards",
      "cart",
      "wishlist",
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

module.exports = router;
