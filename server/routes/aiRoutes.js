const express = require("express");
const router = express.Router();
const {
    analyzeResumeAction,
    reviewPortfolioAction,
    architectPortfolio,
    suggestDesignAction,
    careerAdviceAction,
    autoImprovePortfolio,
    generateInterviewAction,
    voiceAssistantAction,
    generateVideoScriptAction,
    translatePortfolioAction
} = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/analyze-resume", protect, analyzeResumeAction);
router.post("/review-portfolio", protect, reviewPortfolioAction);
router.post("/architect-portfolio", protect, architectPortfolio);
router.post("/suggest-design", protect, suggestDesignAction);
router.post("/career-advice", protect, careerAdviceAction);
router.post("/auto-improve/:portfolioId", protect, autoImprovePortfolio);
router.post("/generate-interview/:portfolioId", protect, generateInterviewAction);
router.post("/voice-assistant", protect, voiceAssistantAction);
router.post("/script-video/:portfolioId", protect, generateVideoScriptAction);
router.post("/translate-portfolio", protect, translatePortfolioAction);

module.exports = router;
