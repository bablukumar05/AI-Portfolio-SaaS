const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { workspaceSchema } = require("../schemas");

const { checkWorkspaceRole } = require("../middleware/workspaceMiddleware");

router.post("/", protect, validate(workspaceSchema), workspaceController.createWorkspace);
router.get("/", protect, workspaceController.getUserWorkspaces);
router.get("/:id", protect, workspaceController.getWorkspace);

// Admin/Owner only actions
router.post("/:workspaceId/invite", protect, checkWorkspaceRole(["owner", "admin"]), workspaceController.inviteMember);
router.delete("/:workspaceId/members", protect, checkWorkspaceRole(["owner", "admin"]), workspaceController.removeMember);

// Manage portfolios in workspace
router.post("/:workspaceId/portfolios", protect, checkWorkspaceRole(["owner", "admin", "editor"]), workspaceController.addPortfolioToWorkspace);

module.exports = router;
