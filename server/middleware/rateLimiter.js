const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 500, // Allow high throughput for SPA dashboard features
    message: "Too many requests, please try again later.",
    skip: (req) => req.path === "/api/health" || req.path === "/"
});

module.exports = limiter;