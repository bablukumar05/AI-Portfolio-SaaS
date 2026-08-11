const Portfolio = require("../models/Portfolio");

// Get showcase feed
exports.getShowcase = async (req, res, next) => {
    try {
        const { industry, template, sort } = req.query;

        let query = { status: "published" };
        if (industry) query["sections.data.industry"] = new RegExp(industry, "i");
        if (template) query.theme = template;

        let sortOption = { isFeatured: -1, viewCount: -1 };
        if (sort === "newest") sortOption = { createdAt: -1 };

        const portfolios = await Portfolio.find(query)
            .populate("user", "name profilePicture")
            .sort(sortOption)
            .limit(24);

        res.status(200).json({ success: true, data: portfolios });
    } catch (error) { next(error); }
};

// Get single showcase item details
exports.getShowcaseItem = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.findOne({
            _id: req.params.id,
            status: "published"
        }).populate("user", "name profilePicture bio");

        if (!portfolio) return res.status(404).json({ msg: "Portfolio not found or private" });

        res.status(200).json({ success: true, data: portfolio });
    } catch (error) { next(error); }
};
