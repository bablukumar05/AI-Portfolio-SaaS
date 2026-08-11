const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'hero', 'about', 'projects', 'contact'
  data: { type: mongoose.Schema.Types.Mixed, default: {} } // flexible payload
});

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    title: { type: String, default: "My Portfolio" },
    domain: { type: String, unique: true, sparse: true },
    design: {
      theme: { type: String, default: "cyberpunk" },
      font: { type: String, default: "Inter" }
    },
    sections: [SectionSchema],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
    subdomain: { type: String, unique: true, sparse: true },
    customDomain: { type: String, unique: true, sparse: true },
    isFeatured: { type: Boolean, default: false },
    showcaseTags: [{ type: String }],
    views: { type: Number, default: 0 },
    seoSettings: {
      title: { type: String },
      description: { type: String },
      keywords: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);