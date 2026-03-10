const express = require("express");
const { connectDB } = require("../../lib/db");
const { requireSuperAdmin } = require("../../middleware/auth");
const { ActivityLogModel } = require("../../lib/activityLog");

const router = express.Router();

router.get("/", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const { entity, action, adminId, limit = 100, page = 1 } = req.query;

    const filter = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;
    if (adminId) filter.adminId = adminId;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total, uniqueAdmins] = await Promise.all([
      ActivityLogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ActivityLogModel.countDocuments(filter),
      ActivityLogModel.aggregate([
        {
          $group: {
            _id: "$adminId",
            name: { $first: "$adminName" },
            email: { $first: "$adminEmail" }
          }
        },
        { $sort: { name: 1 } }
      ])
    ]);

    const formattedAdmins = uniqueAdmins.map(a => ({
      id: a._id,
      name: a.name,
      email: a.email
    }));

    return res.json({ 
      logs, 
      total, 
      page: Number(page), 
      totalPages: Math.ceil(total / Number(limit)),
      admins: formattedAdmins 
    });
  } catch (error) {
    console.error("Logs fetch error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
