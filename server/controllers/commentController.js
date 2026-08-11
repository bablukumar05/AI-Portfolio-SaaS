const Comment = require("../models/Comment");

// Add a comment
exports.addComment = async (req, res, next) => {
    try {
        const { content, projectId, workspaceId, parentCommentId, type } = req.body;
        const comment = await Comment.create({
            content,
            author: req.user.id,
            project: projectId,
            workspace: workspaceId,
            parentComment: parentCommentId,
            type: type || "internal",
        });
        res.status(201).json({ success: true, data: comment });
    } catch (error) { next(error); }
};

// Get comments for a project
exports.getProjectComments = async (req, res) => {
    try {
        const { projectId } = req.params;
        const comments = await Comment.find({ project: projectId })
            .populate("author", "name profilePicture")
            .populate("parentComment")
            .sort("-createdAt");
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get comments for a workspace
exports.getWorkspaceComments = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const comments = await Comment.find({ workspace: workspaceId })
            .populate("author", "name profilePicture")
            .populate("parentComment")
            .sort("-createdAt");
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Resolve a comment
exports.resolveComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(
            id,
            { resolved: true },
            { new: true }
        );
        res.status(200).json({ success: true, data: comment });
    } catch (error) { next(error); }
};
