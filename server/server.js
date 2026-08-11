const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const limiter = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// Startup Environment Validation
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "OPENAI_API_KEY"];
requiredEnv.forEach((env) => {
    if (!process.env[env]) {
        logger.error(`Critical Error: Missing environment variable ${env}`);
        process.exit(1);
    }
});

const http = require("http");
const socket = require("./socket");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socket.init(server);

connectDB();

app.use(helmet()); // Security Headers
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(limiter);

// Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const commentRoutes = require("./routes/commentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const healthRoutes = require("./routes/healthRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const securityRoutes = require("./routes/securityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const knowledgeBaseRoutes = require("./routes/knowledgeBaseRoutes");
const showcaseRoutes = require("./routes/showcaseRoutes");

app.get("/", (req, res) => {
    res.json({
        message: "🚀 AI Portfolio SaaS API Server is Live & Running!",
        status: "healthy",
        healthCheck: "/api/health",
        endpoints: {
            auth: "/api/auth",
            blogs: "/api/blogs",
            projects: "/api/projects",
            portfolio: "/api/portfolio",
            dashboard: "/api/dashboard",
            contact: "/api/contact",
            ai: "/api/ai",
            health: "/api/health"
        }
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/knowledge", knowledgeBaseRoutes);
app.use("/api/showcase", showcaseRoutes);

const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));

// Graceful Shutdown
process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    process.exit(0);
});
