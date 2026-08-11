const express = require("express");
const router = express.Router();
const showcaseController = require("../controllers/showcaseController");

// Public routes for showcase
router.get("/", showcaseController.getShowcase);
router.get("/:id", showcaseController.getShowcaseItem);

module.exports = router;
