const Workspace = require("../models/Workspace");

/**
 * Middleware to check if user has required role in the workspace.
 * Requires workspaceId in req.params or req.body
 */
const checkWorkspaceRole = (roles) => async (req, res, next) => {
    try {
        const workspaceId = req.params.workspaceId || req.body.workspaceId || req.params.id;
        if (!workspaceId) {
            return res.status(400).json({ success: false, message: "Workspace ID required" });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found" });
        }

        // Check if user is owner
        if (workspace.owner.toString() === req.user.id) {
            req.workspace = workspace;
            return next();
        }

        // Check member roles
        const member = workspace.members.find(m => m.user.toString() === req.user.id);
        if (!member || !roles.includes(member.role)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Insufficient permissions for this workspace"
            });
        }

        req.workspace = workspace;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { checkWorkspaceRole };
