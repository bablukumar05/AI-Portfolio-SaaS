const router = require("express").Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.chat);

module.exports = router;
