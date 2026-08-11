const Activity = require("../models/Activity");

/**
 * Log a user activity.
 * @param {string} userId - ID of the user.
 * @param {string} action - Action performed (e.g., "Project Created").
 * @param {string} entityType - Type of entity (Project, Blog, etc).
 * @param {string} entityId - Optional ID of the entity.
 * @param {string} description - Optional description.
 */
exports.logActivity = async (userId, action, entityType, entityId = null, description = "") => {
    try {
        const activity = new Activity({
            userId,
            action,
            entityType,
            entityId,
            description
        });
        await activity.save();
        return activity;
    } catch (err) {
        console.error("Error logging activity:", err);
    }
};
