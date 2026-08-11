const router = require("express").Router();

const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const protect = require("../middleware/authMiddleware");

const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../schemas");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// 2FA Routes
router.post("/enable-2fa", protect, authController.enable2FA);
router.post("/verify-2fa", protect, authController.verify2FA);
router.post("/verify-2fa-login", authController.verify2FALogin);
router.post("/generate-api-key", protect, authController.generateAPIKey);

router.put("/profile", protect, authController.updateProfile);

module.exports = router;