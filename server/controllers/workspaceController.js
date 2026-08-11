const Workspace = require("../models/Workspace");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const { logActivity } = require("../utils/activityLogger");

// Create a new workspace
exports.createWorkspace = async (req, res, next) => {
    try {
        const { name, description, plan } = req.body;
        const workspace = await Workspace.create({
            name,
            description,
            plan: plan || "free",
            owner: req.user.id,
            members: [{ user: req.user.id, role: "owner" }],
        });

        await logActivity(req.user.id, "Workspace Created", "Workspace", workspace._id, `Created workspace: ${name}`);

        res.status(201).json({ success: true, data: workspace });
    } catch (error) {
        next(error);
    }
};

// Get all workspaces for the logged in user
exports.getUserWorkspaces = async (req, res, next) => {
    try {
        const workspaces = await Workspace.find({
            $or: [{ owner: req.user.id }, { "members.user": req.user.id }],
        })
            .populate("owner", "name email")
            .populate("members.user", "name email")
            .populate("portfolios", "title domain");

        res.status(200).json({ success: true, data: workspaces });
    } catch (error) {
        next(error);
    }
};

// Get single workspace details
exports.getWorkspace = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members.user", "name email")
            .populate("portfolios");

        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found" });

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        next(error);
    }
};

// Invite a member to the workspace
exports.inviteMember = async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const workspace = req.workspace; // From middleware

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if already a member
        const isMember = workspace.members.find((m) => m.user.toString() === userToInvite._id.toString());
        if (isMember) {
            return res.status(400).json({ success: false, message: "User is already a member" });
        }

        workspace.members.push({ user: userToInvite._id, role: role || "viewer" });
        await workspace.save();

        await logActivity(req.user.id, "Member Invited", "Workspace", workspace._id, `Invited ${email} as ${role}`);

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        next(error);
    }
};

// Remove a member from the workspace
exports.removeMember = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const workspace = req.workspace;

        if (workspace.owner.toString() === userId) {
            return res.status(400).json({ success: false, message: "Cannot remove owner" });
        }

        workspace.members = workspace.members.filter(m => m.user.toString() !== userId);
        await workspace.save();

        await logActivity(req.user.id, "Member Removed", "Workspace", workspace._id, `Removed member ${userId}`);

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        next(error);
    }
};

// Add portfolio to workspace
exports.addPortfolioToWorkspace = async (req, res, next) => {
    try {
        const { portfolioId } = req.body;
        const workspace = req.workspace;

        if (workspace.portfolios.includes(portfolioId)) {
            return res.status(400).json({ success: false, message: "Portfolio already in workspace" });
        }

        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) return res.status(404).json({ success: false, message: "Portfolio not found" });

        workspace.portfolios.push(portfolioId);
        await workspace.save();

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        next(error);
    }
};
