const express = require("express");
const ordersRouter = require("./orders");

const router = express.Router();

router.use("/content", require("./content"));
router.use("/orders", ordersRouter);
router.use("/", ordersRouter);
router.use("/reviews", require("./reviews"));

module.exports = router;
