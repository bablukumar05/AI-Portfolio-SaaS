const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const protect = require("../middleware/authMiddleware");

router.get("/:portfolioId", protect, analyticsController.getPortfolioStats);
router.post("/interaction", analyticsController.recordInteraction);

module.exports = router;
