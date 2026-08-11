const mongoose = require("mongoose");

const KnowledgeBaseSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        metadata: {
            type: { type: String, enum: ["certificate", "project_detail", "skill_depth", "other"] },
            date: { type: Date }
        },
        vectorId: { type: String } // For external vector DB if used later
    },
    { timestamps: true }
);

module.exports = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);
