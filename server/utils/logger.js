const winston = require("winston");
const path = require("path");

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
);

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: logFormat,
    transports: [
        // Console output for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
        }),
        // File output for production
        new winston.transports.File({
            filename: path.join(__dirname, "../logs/error.log"),
            level: "error"
        }),
        new winston.transports.File({
            filename: path.join(__dirname, "../logs/combined.log")
        }),
    ],
});

module.exports = logger;
