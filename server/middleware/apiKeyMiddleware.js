const User = require("../models/User");

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.header("X-API-KEY");
    if (!apiKey) {
        return res.status(401).json({ success: false, message: "API key is missing" });
    }

    try {
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid API key" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = apiKeyAuth;
