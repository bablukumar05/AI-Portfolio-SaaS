const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        members: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                role: {
                    type: String,
                    enum: ["owner", "admin", "editor", "viewer"],
                    default: "editor",
                },
            },
        ],
        portfolios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }],
        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
            default: "free",
        },
        description: { type: String },
        settings: {
            isPrivate: { type: Boolean, default: true },
        },
    },
    { timestamps: true }
);

// Slugify name before save
WorkspaceSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
