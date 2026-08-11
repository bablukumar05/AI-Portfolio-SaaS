const mongoose = require("mongoose");
const Analytics = require("../models/Analytics");
const Portfolio = require("../models/Portfolio");

// Get analytics for a specific portfolio
exports.getPortfolioStats = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;

        // Total views
        const totalViews = await Analytics.countDocuments({ portfolioId });

        // Country breakdown
        const countryBreakdown = await Analytics.aggregate([
            { $match: { portfolioId: new mongoose.Types.ObjectId(portfolioId) } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Device breakdown
        const deviceBreakdown = await Analytics.aggregate([
            { $match: { portfolioId: new mongoose.Types.ObjectId(portfolioId) } },
            { $group: { _id: "$device.type", count: { $sum: 1 } } }
        ]);

        // Recent visits
        const recentVisits = await Analytics.find({ portfolioId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                totalViews,
                countryBreakdown,
                deviceBreakdown,
                recentVisits
            }
        });
    } catch (error) {
        next(error);
    }
};

// Record interaction (scroll depth, duration)
exports.recordInteraction = async (req, res, next) => {
    try {
        const { analyticsId, scrollDepth, duration } = req.body;

        await Analytics.findByIdAndUpdate(analyticsId, {
            $max: { scrollDepth },
            $inc: { duration }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
