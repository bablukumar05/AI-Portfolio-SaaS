const Project = require("../models/Project");

exports.getProjects = async (req, res, next) => {
  try {
    // If you have a single-tenant portfolio, fetch all. 
    // Otherwise, fetch by domain or requested userId.
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
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
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: "Deleted" });
  } catch (err) {
    next(err);
  }
};