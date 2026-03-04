const express = require("express");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../../lib/db");
const { UserModel } = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");

const router = express.Router();

router.post("/", requireAdmin, async (req, res) => {
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

router.patch("/:id", requireAdmin, async (req, res) => {
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

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await UserModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
