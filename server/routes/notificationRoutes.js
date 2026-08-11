const router = require("express").Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

router.get("/", notificationController.getNotifications);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:notificationId", notificationController.markAsRead);
router.delete("/:notificationId", notificationController.deleteNotification);

module.exports = router;
