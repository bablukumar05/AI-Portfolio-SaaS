const socketio = require("socket.io");
const logger = require("./utils/logger");

let io;

const init = (server) => {
    io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        logger.info(`New client connected: ${socket.id}`);

        socket.on("join", (userId) => {
            socket.join(userId);
            logger.debug(`User ${userId} joined their notification room`);
        });

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

const notifyUser = (userId, notification) => {
    if (io) {
        io.to(userId).emit("notification", notification);
    }
};

module.exports = { init, getIO, notifyUser };
