const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Portfolio = require("../models/Portfolio");
const openaiService = require("../services/openaiService");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

// GET portfolio (Private)
router.get("/", auth, async (req, res) => {
  const data = await Portfolio.findOne({ userId: req.user.id });
  res.json(data);
});

// SAVE portfolio
router.post("/", auth, async (req, res) => {
  const existing = await Portfolio.findOne({ userId: req.user.id });

  if (existing) {
    if (req.body.sections) existing.sections = req.body.sections;
    if (req.body.design) existing.design = req.body.design;
    await existing.save();
    return res.json(existing);
  }

  const newPortfolio = new Portfolio({
    userId: req.user.id,
    sections: req.body.sections || [],
    design: req.body.design || { theme: "dark", font: "Inter" }
  });

  await newPortfolio.save();
  res.json(newPortfolio);
});

// GENERATE portfolio from resume (with DEMO Fallback)
router.post("/generate", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No resume file uploaded" });
    }

    // Check for valid API Key
    const apiKey = process.env.OPENAI_API_KEY;
    const isMockMode = !apiKey || apiKey.includes("xxxx");

    if (isMockMode) {
      console.warn("⚠️ OpenAI API Key is missing. Returning DEMO mock portfolio.");
      // HIGH QUALITY MOCK DATA
      return res.json({
        sections: [
          {
            "id": "hero-demo",
            "type": "Hero",
            "data": {
              "heading": "Building the Future <br /> <span class='text-gradient'>One Pixel at a Time</span>",
              "subheading": "Demo Mode: Professional Portfolio",
              "description": "This is a demo portfolio generated because no OpenAI API key was found. Once you add your key, this text will be personalized from your resume!",
              "primaryButton": "View Projects",
              "secondaryButton": "Get in Touch"
            }
          },
          {
            "id": "about-demo",
            "type": "About",
            "data": {
              "title": "Passionate Developer & <span class='text-gradient'>UI Designer</span>",
              "subtitle": "My Story",
              "description1": "I am a skilled full-stack developer with experience in building clean, scalable web applications. My expertise lies in the MERN stack and creating delightful user experiences.",
              "description2": "I believe in the power of innovation and constant learning. This demo illustrates how your content will look once processed by our AI.",
              "skillsTitle": "Top Skills",
              "skillsList": "React, Node.js, TypeScript, Tailwind CSS, MongoDB, Motion"
            }
          },
          {
            "id": "projects-demo",
            "type": "Projects",
            "data": {
              "title": "Featured Projects",
              "subtitle": "A collection of my recent work"
            }
          }
        ]
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const prompt = `You are an expert copywriter. Generate an elegant portfolio layout based on the resume text.
    Return ONLY a valid JSON object matching this schema:
    {
      "sections": [
        { "id": "hero-1", "type": "Hero", "data": { "heading": "...", "subheading": "...", "description": "...", "primaryButton": "...", "secondaryButton": "..." } },
        { "id": "about-1", "type": "About", "data": { "title": "...", "subtitle": "...", "description1": "...", "description2": "...", "skillsTitle": "...", "skillsList": "..." } },
        { "id": "projects-1", "type": "Projects", "data": { "title": "...", "subtitle": "..." } }
      ]
    }
    Resume Text: ${resumeText}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);
    res.json(parsedData);
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ msg: error.message });
  }
});

// GET Public Portfolio (and increment views)
router.get("/public/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.params.userId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ msg: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// GENERATE SEO Tags
router.post("/seo", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });

    const seoTags = await openaiService.generateSEOTags(portfolio);
    portfolio.seoSettings = seoTags;
    await portfolio.save();

    res.json(seoTags);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;