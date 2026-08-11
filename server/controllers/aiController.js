const {
    analyzeResume,
    reviewPortfolio,
    generateFullPortfolio,
    suggestDesign,
    generateCareerAdvice,
    generateInterviewQuestions,
    generateVideoPortfolioScript,
    translatePortfolio
} = require("../services/openaiService");
const { getRelevantContext } = require("../services/ragService");
const Portfolio = require("../models/Portfolio");

// ... (keep all existing actions)

exports.translatePortfolioAction = async (req, res, next) => {
    try {
        const { portfolioId, targetLanguage } = req.body;
        const portfolio = await Portfolio.findById(portfolioId);
        const translated = await translatePortfolio(portfolio, targetLanguage);
        res.status(200).json({ success: true, data: translated });
    } catch (error) { next(error); }
};

exports.analyzeResumeAction = async (req, res, next) => {
    try {
        const { resumeText } = req.body;
        if (!resumeText) return res.status(400).json({ success: false, message: "Resume text is required" });
        const analysis = await analyzeResume(resumeText);
        res.status(200).json({ success: true, data: analysis });
    } catch (error) { next(error); }
};

exports.reviewPortfolioAction = async (req, res, next) => {
    try {
        const { portfolioData } = req.body;
        if (!portfolioData) return res.status(400).json({ success: false, message: "Portfolio data is required" });
        const review = await reviewPortfolio(portfolioData);
        res.status(200).json({ success: true, data: review });
    } catch (error) { next(error); }
};

exports.architectPortfolio = async (req, res, next) => {
    try {
        const { resumeText } = req.body;
        if (!resumeText) return res.status(400).json({ success: false, message: "Resume text is required" });
        const portfolio = await generateFullPortfolio(resumeText);
        res.status(200).json({ success: true, data: portfolio });
    } catch (error) { next(error); }
};

exports.suggestDesignAction = async (req, res, next) => {
    try {
        const { industry, experienceLevel } = req.body;
        const suggestion = await suggestDesign(industry, experienceLevel);
        res.status(200).json({ success: true, data: suggestion });
    } catch (error) { next(error); }
};

exports.careerAdviceAction = async (req, res, next) => {
    try {
        const { skills, targetRole } = req.body;
        const advice = await generateCareerAdvice(skills, targetRole);
        res.status(200).json({ success: true, data: advice });
    } catch (error) { next(error); }
};

exports.autoImprovePortfolio = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });

        // Logic to run multiple AI improvements in parallel or series
        const improvedData = await generateFullPortfolio(JSON.stringify(portfolio));

        portfolio.sections = improvedData.sections;
        await portfolio.save();

        res.status(200).json({ success: true, data: portfolio });
    } catch (error) { next(error); }
};

exports.generateInterviewAction = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const portfolio = await Portfolio.findById(portfolioId);
        const questions = await generateInterviewQuestions(portfolio);
        res.status(200).json({ success: true, data: questions });
    } catch (error) { next(error); }
};

exports.voiceAssistantAction = async (req, res, next) => {
    try {
        const { query, portfolioId } = req.body;
        const portfolio = await Portfolio.findById(portfolioId);

        // Use RAG if context exists
        const extraContext = await getRelevantContext(portfolio.user, query);

        // Final AI Prompt (Simplified)
        // In reality, this would be a full OpenAI call
        res.status(200).json({
            success: true,
            data: {
                answer: `Hi, I'm ${portfolio.title}'s assistant. I found this for you: ${extraContext.substring(0, 100)}...`
            }
        });
    } catch (error) { next(error); }
};

exports.generateVideoScriptAction = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const portfolio = await Portfolio.findById(portfolioId);
        const script = await generateVideoPortfolioScript(portfolio);
        res.status(200).json({ success: true, data: script });
    } catch (error) { next(error); }
};
