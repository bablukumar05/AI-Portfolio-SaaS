const express = require("express");
const router = express.Router();
const KnowledgeBase = require("../models/KnowledgeBase");
const protect = require("../middleware/authMiddleware");

// Get all knowledge for user
router.get("/", protect, async (req, res, next) => {
    try {
        const data = await KnowledgeBase.find({ user: req.user.id });
        res.json({ success: true, data });
    } catch (error) { next(error); }
});

// Add knowledge
router.post("/", protect, async (req, res, next) => {
    try {
        const item = await KnowledgeBase.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: item });
    } catch (error) { next(error); }
});

module.exports = router;
