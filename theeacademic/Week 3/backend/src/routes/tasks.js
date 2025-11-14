const express = require('express');
const Task = require('../models/Task');
const { authRequired, permit } = require('../middleware/auth');
const { validateTask, sanitizeString } = require('../utils/validation');

const router = express.Router();

// GET /api/tasks - list tasks (user sees only their tasks, admin sees all)
router.get('/', authRequired, permit('user', 'admin'), async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  try {
    const filter = {};
    if (req.user.role === 'user') filter.owner = req.user.id;
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return res.json({ page, limit, total, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks - create task
router.post('/', authRequired, permit('user', 'admin'), async (req, res) => {
  const { title, description } = req.body || {};
  const { valid, errors, sanitized } = validateTask({ title, description });
  if (!valid) return res.status(400).json({ errors });
  try {
    const task = new Task({ owner: req.user.id, title: sanitized.title, description: sanitized.description });
    await task.save();
    return res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tasks/:id - admin only
router.delete('/:id', authRequired, permit('admin'), async (req, res) => {
  const id = sanitizeString(req.params.id);
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks/search - search tasks by title/description with pagination
router.post('/search', authRequired, permit('user', 'admin'), async (req, res) => {
  const q = sanitizeString((req.body && req.body.q) || '');
  const page = Math.max(1, parseInt(req.body.page) || 1);
  const limit = Math.min(100, parseInt(req.body.limit) || 10);
  const skip = (page - 1) * limit;
  try {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // escape regex
    const baseFilter = { $or: [{ title: regex }, { description: regex }] };
    if (req.user.role === 'user') baseFilter.owner = req.user.id;
    const total = await Task.countDocuments(baseFilter);
    const tasks = await Task.find(baseFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return res.json({ page, limit, total, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks/filter - filter by status and date range
router.post('/filter', authRequired, permit('user', 'admin'), async (req, res) => {
  const status = sanitizeString((req.body && req.body.status) || '');
  const from = sanitizeString((req.body && req.body.from) || '');
  const to = sanitizeString((req.body && req.body.to) || '');
  const page = Math.max(1, parseInt(req.body.page) || 1);
  const limit = Math.min(100, parseInt(req.body.limit) || 10);
  const skip = (page - 1) * limit;
  try {
    const filter = {};
    if (status) filter.status = status;
    if (from || to) filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
    if (req.user.role === 'user') filter.owner = req.user.id;
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return res.json({ page, limit, total, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
