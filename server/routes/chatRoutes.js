const router = require("express").Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, chatController.chat);

module.exports = router;
