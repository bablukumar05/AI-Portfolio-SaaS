const router = require("express").Router();

const authController = require("../controllers/authController");
const validate = require("../middleware/validate");

router.post("/register", validate, authController.register);
router.post("/login", validate, authController.login);

module.exports = router;