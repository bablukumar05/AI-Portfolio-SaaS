const Redis = require("ioredis");

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
};

let redis = null;

// Only initialize if REDIS_ENABLED is set to true in .env
if (process.env.REDIS_ENABLED === "true") {
    try {
        redis = new Redis(redisConfig);
        redis.on("connect", () => console.log("✅ Redis Connected"));
        redis.on("error", (err) => {
            console.error("❌ Redis Error:", err.message);
        });
    } catch (error) {
        console.error("❌ Redis Initialization Failed:", error.message);
    }
} else {
    console.log("ℹ️ Redis is disabled. Set REDIS_ENABLED=true in .env to enable caching.");
}

module.exports = { redis, redisConfig };
