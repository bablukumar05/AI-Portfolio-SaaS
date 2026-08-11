const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const protect = require("../middleware/authMiddleware");

router.get("/", marketplaceController.getAllTemplates);
router.post("/:id/use", protect, marketplaceController.useTemplate);
router.post("/", protect, marketplaceController.createTemplate);
router.post("/clone", protect, marketplaceController.cloneTheme);

module.exports = router;
