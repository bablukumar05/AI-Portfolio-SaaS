const { UAParser } = require("ua-parser-js");
const axios = require("axios");
const Analytics = require("../models/Analytics");
const Portfolio = require("../models/Portfolio");
const { createNotification } = require("../controllers/notificationController");
const logger = require("../utils/logger");

const trackVisitor = async (req, res, next) => {
    // Skip if not a portfolio view or if it's an internal API call
    if (!req.params.portfolioId) return next();

    try {
        const portfolio = await Portfolio.findById(req.params.portfolioId);
        if (!portfolio) return next();

        const uaString = req.headers["user-agent"] || "";
        const parser = new UAParser(uaString);
        const agent = parser.getResult();
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const referer = req.headers["referer"] || "Direct";

        // Basic Device Type Detection
        let deviceType = "desktop";
        if (/mobile/i.test(uaString)) deviceType = "mobile";
        if (/tablet/i.test(uaString)) deviceType = "tablet";

        // Optional: Get Location from IP (using a free API for now)
        // Note: In production, use a local DB like GeoIP for speed
        let country = "Unknown";
        try {
            const locResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country`);
            if (locResponse.data.status === "success") {
                country = locResponse.data.country;
            }
        } catch (e) {
            logger.warn(`Failed to fetch location for IP: ${ip}`);
        }

        await Analytics.create({
            portfolioId: req.params.portfolioId,
            ip,
            country,
            device: {
                type: deviceType,
                browser: agent.browser.name || "Unknown",
                os: agent.os.name || "Unknown"
            },
            source: referer,
            path: req.originalUrl
        });

        // Trigger Notification for the Owner
        await createNotification(
            portfolio.user,
            "view",
            `Your portfolio "${portfolio.title}" was just viewed from ${country}.`,
            `/dashboard/analytics/${portfolio._id}`
        );

        next();
    } catch (error) {
        logger.error(`Analytics Tracking Error: ${error.message}`);
        next(); // Don't block the user if analytics fails
    }
};

module.exports = trackVisitor;
