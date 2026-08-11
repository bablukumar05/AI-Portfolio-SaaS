const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");

// Stripe Routes
router.post("/checkout", protect, paymentController.checkoutAction);
router.post("/portal", protect, paymentController.portalAction);
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.stripeWebhook);

// Razorpay Routes
router.post("/order", protect, paymentController.createOrder);
router.post("/verify", protect, paymentController.verifyPayment);

module.exports = router;
