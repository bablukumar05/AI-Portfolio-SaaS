const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: "Full Stack" },
    status: { type: String, default: "Live" },
    featured: { type: Boolean, default: false },
    imageUrl: { type: String },
    githubLink: { type: String },
    liveLink: { type: String },
    technologies: [{ type: String }],
    features: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
