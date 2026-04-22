const router = require("express").Router();
const blogController = require("../controllers/blogController");
const auth = require("../middleware/authMiddleware");

// Public Routes
router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlogBySlug);
router.put("/:id/like", blogController.likeBlog);

// Protected Routes (CRUD & AI)
router.post("/:id/comment", auth, blogController.addComment);
router.post("/", auth, blogController.addBlog);
router.put("/:id", auth, blogController.updateBlog);
router.delete("/:id", auth, blogController.deleteBlog);
router.post("/generate", auth, blogController.generateAIContent);

module.exports = router;
