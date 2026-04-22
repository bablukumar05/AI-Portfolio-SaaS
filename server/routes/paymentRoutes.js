const router = require("express").Router();
const paymentController = require("../controllers/paymentController");

router.post("/order", paymentController.createOrder);

module.exports = router;
