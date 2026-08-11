const express = require("express");
const router = express.Router();
const { getQueue } = require("../services/queueService");
const protect = require("../middleware/authMiddleware");

// Admin Only Queue Monitoring
router.get("/queue-health", protect, async (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });

    try {
        const queue = getQueue();
        if (!queue) return res.status(503).json({ msg: "Queue service not available" });

        const counts = await queue.getJobCounts();
        res.json({ success: true, data: counts });
    } catch (err) { next(err); }
});

module.exports = router;
