const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { commentSchema } = require("../schemas");

router.post("/", protect, validate(commentSchema), commentController.addComment);
router.get("/project/:projectId", protect, commentController.getProjectComments);
router.get("/workspace/:workspaceId", protect, commentController.getWorkspaceComments);
router.patch("/:id/resolve", protect, commentController.resolveComment);

module.exports = router;
