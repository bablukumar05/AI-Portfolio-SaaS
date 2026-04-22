const Razorpay = require("razorpay");

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