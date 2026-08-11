const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createOrder = async () => {
  return await razorpay.orders.create({
    amount: 50000,
    currency: "INR"
  });
};

exports.verifyPaymentSignature = (orderId, paymentId, signature) => {
  const text = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(text.toString())
    .digest("hex");

  return expectedSignature === signature;
};