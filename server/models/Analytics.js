const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
    {
        portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
        visitorId: { type: String }, // Session or Cookie based ID
        ip: { type: String },
        country: { type: String, default: "Unknown" },
        city: { type: String },
        device: {
            type: { type: String }, // mobile, desktop, tablet
            browser: { type: String },
            os: { type: String }
        },
        source: { type: String, default: "Direct" }, // Referer
        duration: { type: Number, default: 0 }, // in seconds
        scrollDepth: { type: Number, default: 0 }, // max % scrolled
        path: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);
