const Template = require("../models/Template");

// List all templates
exports.getAllTemplates = async (req, res, next) => {
    try {
        const templates = await Template.find().sort({ usageCount: -1 });
        res.status(200).json({ success: true, data: templates });
    } catch (error) { next(error); }
};

// Use a template (increment count)
exports.useTemplate = async (req, res, next) => {
    try {
        const template = await Template.findByIdAndUpdate(
            req.params.id,
            { $inc: { usageCount: 1 } },
            { new: true }
        );
        res.status(200).json({ success: true, data: template });
    } catch (error) { next(error); }
};

// Create a template (Admin only)
exports.createTemplate = async (req, res, next) => {
    try {
        const template = await Template.create(req.body);
        res.status(201).json({ success: true, data: template });
    } catch (error) { next(error); }
};

// Clone a template to user's workspace
exports.cloneTheme = async (req, res, next) => {
    try {
        const { templateId, workspaceId } = req.body;
        const template = await Template.findById(templateId);
        if (!template) return res.status(404).json({ msg: "Theme not found" });

        const newPortfolio = await Portfolio.create({
            workspace: workspaceId,
            user: req.user.id,
            title: `My ${template.name}`,
            theme: template.theme,
            sections: template.config.sections || [],
            status: "draft"
        });

        res.status(201).json({ success: true, data: newPortfolio });
    } catch (error) { next(error); }
};
