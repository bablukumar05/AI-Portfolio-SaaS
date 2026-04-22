const { createOrder } = require("../services/paymentService");

exports.createOrder = async (req, res, next) => {
  try {
    const order = await createOrder();
    res.json(order);
  } catch (err) {
    next(err);
  }
};