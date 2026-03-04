const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel } = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");

const router = express.Router();

router.post("/", requireAdmin, async (req, res) => {
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

router.get("/:id", requireAdmin, async (req, res) => {
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

router.patch("/:id", requireAdmin, async (req, res) => {
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

router.delete("/:id", requireAdmin, async (req, res) => {
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

module.exports = router;
