const router = require("express").Router();
const multer = require("multer");

const uploadController = require("../controllers/uploadController");

// multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// route
router.post("/", upload.single("image"), uploadController.uploadImage);

module.exports = router;