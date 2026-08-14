const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 50,                 // Pre-warmed pool for concurrent connections
            minPoolSize: 5,                  // Keep minimum connections warm
            serverSelectionTimeoutMS: 5000,  // Fast fail-over (5s)
            socketTimeoutMS: 45000,          // 45s socket timeout
        });

        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);

        // Connection event listeners
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("🔄 MongoDB reconnected successfully.");
        });

    } catch (err) {
        console.error("❌ MongoDB Atlas Connection Failed:", err.message);
        console.error("🔍 Check your MONGO_URI, network access (whitelist IP), and credentials.");
        process.exit(1); // Exit process on fatal DB error
    }
};

module.exports = connectDB;