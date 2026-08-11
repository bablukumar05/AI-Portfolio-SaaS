const express = require("express");
const router = express.Router();
const securityController = require("../controllers/securityController");
const protect = require("../middleware/authMiddleware");

router.get("/settings", protect, securityController.getSecuritySettings);
router.delete("/sessions/:deviceId", protect, securityController.revokeSession);

module.exports = router;
