const Comment = require('../models/Comment');
const Project = require('../models/Project');

exports.getCommentsForProject = async (req, res) => {
  try {
    const comments = await Comment.find({ project: req.params.projectId }).populate('author', 'username').sort({ createdAt: 'asc' });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newComment = new Comment({
      content: req.body.content,
      project: req.body.projectId,
      author: req.user._id,
    });

    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};