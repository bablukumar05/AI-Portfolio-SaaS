const Notification = require("../models/Notification");

/**
 * Create a new notification for a user.
 * @param {string} userId - ID of the user.
 * @param {string} title - Title of the notification.
 * @param {string} message - Content of the notification.
 * @param {string} type - Type of notification (info, success, etc).
 * @param {string} link - Optional link associated with the notification.
 */
exports.createNotification = async (userId, title, message, type = "info", link = "") => {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            type,
            link
        });
        await notification.save();

        // Future: Emit socket events here for real-time delivery
        // if (global.io) {
        //   global.io.to(userId.toString()).emit("notification", notification);
        // }

        return notification;
    } catch (err) {
        console.error("Error creating notification:", err);
    }
};
