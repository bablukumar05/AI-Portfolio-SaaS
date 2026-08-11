const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true // e.g., "Project Created", "Blog Published", "Login"
        },
        entityType: {
            type: String, // e.g., "Project", "Blog", "Auth", "Portfolio"
            required: true
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId, // Optional ID of the related object
        },
        description: {
            type: String
        },
        metadata: {
            type: Object // Flexible storage for extra data (e.g., browser, IP)
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
