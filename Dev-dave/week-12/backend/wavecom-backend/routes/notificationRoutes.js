import express from 'express';
import { v4 as uuid } from 'uuid';
import Job from '../models/Job.model.js';
import { publishJob } from '../services/producer.service.js';

const router = express.Router();

// Create a notification job
router.post('/', async (req, res) => {
  try {
    const { channel, recipient, payload } = req.body;
    if (!channel || !recipient) return res.status(400).json({ error: 'channel and recipient required' });

    const job = await Job.create({
      jobId: uuid(),
      channel,
      recipient,
      payload
    });

    publishJob(job.jobId);

    return res.status(201).json({ jobId: job.jobId });
  } catch (err) {
    console.error('POST /api/notifications error:', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Get job by jobId
router.get('/:jobId', async (req, res) => {
  const job = await Job.findOne({ jobId: req.params.jobId });
  if (!job) return res.status(404).json({ error: 'not found' });
  res.json(job);
});

// List jobs (recent)
router.get('/', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
  res.json(jobs);
});

export default router;
