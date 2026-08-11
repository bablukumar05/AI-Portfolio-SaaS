const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true, required: true },
        theme: { type: String, required: true },
        previewImage: { type: String },
        price: { type: Number, default: 0 },
        isPremium: { type: Boolean, default: false },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For user-contributed templates
        config: { type: mongoose.Schema.Types.Map, of: mongoose.Schema.Types.Mixed }, // Layout/Style structure
        category: { type: String, enum: ["Professional", "Creative", "Minimal", "Tech"], default: "Tech" },
        usageCount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
