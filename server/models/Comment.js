const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
        type: { type: String, enum: ["internal", "review"], default: "internal" },
        resolved: { type: Boolean, default: false },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // For replies
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
