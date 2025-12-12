import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  time: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, index: true },
  channel: { type: String, required: true },  // 'email' | 'sms' | 'push'
  recipient: { type: String, required: true },
  payload: { type: Object, default: {} },
  status: { type: String, default: 'queued' }, // queued|processing|delivered|failed
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  lastError: { type: String, default: null },
  logs: [logSchema]
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
