const { Queue, Worker } = require("bullmq");
const { redisConfig } = require("../config/redisConfig");
const { analyzeResume, reviewPortfolio } = require("./openaiService");

let aiQueue = null;
let aiWorker = null;

// Helper to check if Redis is available and configured
const isRedisEnabled = process.env.REDIS_ENABLED === "true";

if (isRedisEnabled) {
    try {
        aiQueue = new Queue("ai-tasks", { connection: redisConfig });

        // Crucial: Handle queue errors to prevent crashes
        aiQueue.on("error", (err) => {
            console.error("❌ BullMQ Queue Error (Check Redis):", err.message);
        });

        aiWorker = new Worker(
            "ai-tasks",
            async (job) => {
                const { type, data } = job.data;
                console.log(`Processing job ${job.id} of type ${type}`);

                if (type === "analyze-resume") {
                    return await analyzeResume(data.resumeText);
                } else if (type === "review-portfolio") {
                    return await reviewPortfolio(data.portfolioData);
                }
            },
            { connection: redisConfig }
        );

        aiWorker.on("completed", (job) => {
            console.log(`Job ${job.id} completed!`);
        });

        aiWorker.on("failed", (job, err) => {
            console.log(`Job ${job.id} failed: ${err.message}`);
        });

        // Crucial: Handle worker errors
        aiWorker.on("error", (err) => {
            console.error("❌ BullMQ Worker Error (Check Redis):", err.message);
        });

        console.log("✅ BullMQ AI Queue/Worker Initialized");
    } catch (error) {
        console.error("❌ BullMQ Initialization Failed:", error.message);
    }
} else {
    console.log("ℹ️ BullMQ is disabled (REDIS_ENABLED != true). Background tasks will skip the queue.");
}

module.exports = { aiQueue };
