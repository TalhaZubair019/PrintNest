const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel } = require("../../lib/models");

const router = express.Router();

router.post("/validate-cart", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const productIds = items.map((i) => i.id);

    await connectDB();
    const products = await ProductModel.find({ id: { $in: productIds } }).lean();

    const inventoryMap = {};
    products.forEach((p) => {
      inventoryMap[p.id] = {
        stockQuantity: p.stockQuantity || 0,
        warehouseInventory: p.warehouseInventory || [],
      };
    });

    return res.json(inventoryMap);
  } catch (error) {
    console.error("Cart validation error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
