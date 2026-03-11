const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel } = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");

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

    await logActivity(req, {
      action: "add",
      entity: "product",
      entityId: newId.toString(),
      details: `Added product "${req.body.title || "Untitled"}" (ID: ${newId})`,
    });

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

    const oldProduct = await ProductModel.findOne({
      id: Number(req.params.id),
    }).lean();
    if (!oldProduct)
      return res.status(404).json({ message: "Product not found" });

    const updated = await ProductModel.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { returnDocument: "after" },
    ).lean();
    if (!updated) return res.status(404).json({ message: "Product not found" });

    const trackFields = [
      "title",
      "description",
      "price",
      "oldPrice",
      "image",
      "badges",
      "printText",
      "category",
    ];

    const changes = [];
    for (const field of trackFields) {
      const oldVal = oldProduct[field];
      const newVal = req.body[field];

      if (newVal !== undefined) {
        let hasChanged = false;
        if (Array.isArray(oldVal) || Array.isArray(newVal)) {
          hasChanged = JSON.stringify(oldVal || []) !== JSON.stringify(newVal || []);
        } else {
          hasChanged = String(oldVal ?? "") !== String(newVal ?? "");
        }

        if (hasChanged) {
          const oldStr = Array.isArray(oldVal) ? `[${oldVal.join(", ")}]` : (oldVal ?? "(empty)");
          const newStr = Array.isArray(newVal) ? `[${newVal.join(", ")}]` : (newVal ?? "(empty)");
          const label = field.charAt(0).toUpperCase() + field.slice(1);
          changes.push(`${label}: "${oldStr}" → "${newStr}"`);
        }
      }
    }

    const detailStr =
      changes.length > 0
        ? `Updated product "${updated.title}" (ID: ${req.params.id}) — ${changes.join(", ")}`
        : `Updated product "${updated.title}" (ID: ${req.params.id}) (no field changes)`;

    await logActivity(req, {
      action: "update",
      entity: "product",
      entityId: req.params.id,
      details: detailStr,
    });

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

    await logActivity(req, {
      action: "delete",
      entity: "product",
      entityId: req.params.id,
      details: `Deleted product "${deleted.title}" (ID: ${req.params.id})`,
    });

    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
