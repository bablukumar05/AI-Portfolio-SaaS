const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { redis } = require("../config/redisConfig");

router.get("/", async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
        services: {
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            redis: "disconnected" // Default
        }
    };

    try {
        if (redis && (await redis.ping()) === "PONG") {
            healthcheck.services.redis = "connected";
        }
    } catch (e) {
        healthcheck.services.redis = "error";
    }

    try {
        res.status(200).send(healthcheck);
    } catch (error) {
        healthcheck.message = error.message;
        res.status(503).send();
    }
});

module.exports = router;
