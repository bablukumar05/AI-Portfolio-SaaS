const Notification = require("../models/Notification");
const { notifyUser } = require("../socket");

// Get all notifications for user
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) { next(error); }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.notificationId,
            { isRead: true },
            { new: true }
        );
        res.status(200).json({ success: true, data: notification });
    } catch (error) { next(error); }
};

// Mark all as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) { next(error); }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
    try {
        await Notification.findByIdAndDelete(req.params.notificationId);
        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) { next(error); }
};

// Create notification (internal helper)
exports.createNotification = async (recipientId, type, message, link, senderId = null) => {
    const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type,
        message,
        link
    });

    // Push real-time
    notifyUser(recipientId.toString(), notification);

    return notification;
};
