const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", auth, addProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

module.exports = router;