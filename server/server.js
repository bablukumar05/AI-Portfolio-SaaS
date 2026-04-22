const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const limiter = require("./middleware/rateLimiter");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: err.message || "Internal Server Error" });
});

app.listen(5000, () => console.log("🚀 Server running on 5000"));
// Restarting node