const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { submitContactForm, getMessages, deleteMessage } = require("../controllers/contactController");

router.post("/", submitContactForm);
router.get("/", auth, getMessages);
router.delete("/:id", auth, deleteMessage);

module.exports = router;

