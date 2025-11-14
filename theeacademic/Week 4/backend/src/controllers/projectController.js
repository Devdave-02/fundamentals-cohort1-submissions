const Project = require('../models/Project');

exports.list = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('author', 'username email');
    res.json({ projects });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;
    const project = new Project({ title, description, tags, author: req.userId });
    await project.save();
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('author', 'username email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
};
