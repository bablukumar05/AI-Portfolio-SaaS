const { createCheckoutSession, createPortalSession } = require("../services/stripeService");
const User = require("../models/User");

exports.checkoutAction = async (req, res, next) => {
  try {
    const { priceId } = req.body;
    const session = await createCheckoutSession(req.user.id, priceId);
    res.status(200).json({ success: true, url: session.url });
  } catch (error) { next(error); }
};

exports.portalAction = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.stripeCustomerId) return res.status(400).json({ msg: "No active subscription" });

    const session = await createPortalSession(user.stripeCustomerId);
    res.status(200).json({ success: true, url: session.url });
  } catch (error) { next(error); }
};

exports.stripeWebhook = async (req, res) => {
  // Webhook logic (simplified)
  res.json({ received: true });
};