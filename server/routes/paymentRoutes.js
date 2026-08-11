const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");

router.post("/checkout", protect, paymentController.checkoutAction);
router.post("/portal", protect, paymentController.portalAction);
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.stripeWebhook);

module.exports = router;
