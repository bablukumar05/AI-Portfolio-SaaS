const { redis } = require("../config/redisConfig");

const cacheMiddleware = (duration) => async (req, res, next) => {
    // Skip if redis is not initialized
    if (!redis) {
        return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            console.log(`Cache Hit: ${key}`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        res.originalJson = res.json;
        res.json = (body) => {
            redis.set(key, JSON.stringify(body), "EX", duration || 3600);
            res.originalJson(body);
        };
        next();
    } catch (error) {
        console.error("Cache Middleware Error:", error);
        next();
    }
};

module.exports = cacheMiddleware;
