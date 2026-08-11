const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");

const cacheMiddleware = require("../middleware/cacheMiddleware");

// @route   GET /api/dashboard
// @desc    Get dashboard analytics and user data
// @access  Private
router.get("/", protect, cacheMiddleware(300), getDashboardData);

module.exports = router;
