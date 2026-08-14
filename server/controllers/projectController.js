const Project = require("../models/Project");
const { logActivity } = require("../utils/activityLogger");

exports.getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === "true";

    const projects = await Project.find(filter).sort({ createdAt: -1 }).lean();
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    // Increment view count
    project.views = (project.views || 0) + 1;
    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.addProject = async (req, res, next) => {
  try {
    const project = new Project({
      ...req.body,
      userId: req.user.id
    });

    await project.save();
    await logActivity(req.user.id, "Project Created", "Project", project._id, `Created new project: ${project.title}`);
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user.id },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: "Project deleted successfully", id: req.params.id });
  } catch (err) {
    next(err);
  }
};