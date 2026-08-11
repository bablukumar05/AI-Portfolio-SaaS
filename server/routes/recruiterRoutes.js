const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const protect = require("../middleware/authMiddleware");

// Ideally, check for "recruiter" or "admin" role here
router.get("/search", protect, recruiterController.searchTalent);

module.exports = router;
