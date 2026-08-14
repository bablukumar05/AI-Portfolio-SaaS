const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    tags: [{ type: String }],
    category: { type: String, default: "Tech" },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    metaTitle: { type: String },
    metaDescription: { type: String }
  },
  { timestamps: true }
);

BlogSchema.index({ userId: 1, createdAt: -1 });
BlogSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", BlogSchema);
