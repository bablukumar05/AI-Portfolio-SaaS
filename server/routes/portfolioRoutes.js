const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Portfolio = require("../models/Portfolio");

// GET portfolio
router.get("/", auth, async (req, res) => {
  const data = await Portfolio.findOne({ userId: req.user.id });
  res.json(data);
});

// SAVE portfolio
router.post("/", auth, async (req, res) => {
  const existing = await Portfolio.findOne({ userId: req.user.id });

  if (existing) {
    existing.sections = req.body.sections;
    await existing.save();
    return res.json(existing);
  }

  const newPortfolio = new Portfolio({
    userId: req.user.id,
    sections: req.body.sections
  });

  await newPortfolio.save();
  res.json(newPortfolio);
});

module.exports = router;