const KnowledgeBase = require("../models/KnowledgeBase");

exports.getRelevantContext = async (userId, query) => {
    try {
        // Simple keyword-based search for now (would be vector search in prod)
        const keywords = query.split(" ").filter(w => w.length > 3);
        const context = await KnowledgeBase.find({
            user: userId,
            $or: keywords.map(kw => ({ content: new RegExp(kw, "i") }))
        }).limit(3);

        return context.map(c => c.content).join("\n\n");
    } catch (error) {
        return "";
    }
};
