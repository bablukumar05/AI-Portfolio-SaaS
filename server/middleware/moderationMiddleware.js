const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const moderationMiddleware = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) return next();

        const response = await client.moderations.create({ input: content });
        const [result] = response.results;

        if (result.flagged) {
            return res.status(400).json({
                success: false,
                msg: "Content violates safety guidelines",
                categories: result.categories
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = moderationMiddleware;
