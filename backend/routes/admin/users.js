const express = require("express");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../../lib/db");
const { UserModel } = require("../../lib/models");
const { requireSuperAdmin } = require("../../middleware/auth");

const router = express.Router();

router.post("/", requireSuperAdmin, async (req, res) => {
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
      adminRole: "admin",
      promotedBy: req.user.id,
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

router.patch("/:id", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const updateData = { isAdmin: req.body.isAdmin };
    if (req.body.isAdmin) {
      updateData.adminRole = "admin";
      updateData.promotedBy = req.user.id;
      updateData.promotionPending = true;
      updateData.demotionPending = false;
    } else {
      updateData.adminRole = null;
      updateData.promotedBy = null;
      updateData.promotionPending = false;
      updateData.demotionPending = true;
    }
    const updated = await UserModel.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const targetUser = await UserModel.findOne({ id: req.params.id }).lean();
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    if (targetUser.email === process.env.EMAIL_USER) {
      return res.status(403).json({ message: "Cannot delete the super admin account" });
    }
    await UserModel.findOneAndDelete({ id: req.params.id });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
