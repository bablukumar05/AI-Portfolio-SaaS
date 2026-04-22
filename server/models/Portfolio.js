const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'hero', 'about', 'projects', 'contact'
  data: { type: mongoose.Schema.Types.Mixed, default: {} } // flexible payload
});

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "My Portfolio" },
    domain: { type: String, unique: true, sparse: true },
    theme: { type: String, default: "dark" },
    sections: [SectionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);