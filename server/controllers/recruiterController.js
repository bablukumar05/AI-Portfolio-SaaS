const Portfolio = require("../models/Portfolio");

exports.searchTalent = async (req, res, next) => {
    try {
        const { skills, industry, experience } = req.query;

        let query = { status: "published" };

        if (skills) {
            const skillArray = skills.split(",").map(s => new RegExp(s.trim(), "i"));
            query["sections.data.skills"] = { $in: skillArray };
        }

        const portfolios = await Portfolio.find(query)
            .populate("user", "name email profilePicture")
            .limit(20);

        res.status(200).json({ success: true, data: portfolios });
    } catch (error) { next(error); }
};
