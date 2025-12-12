import 'dotenv/config';
import amqp from 'amqplib';
import mongoose from 'mongoose';
import Job from '../src/models/Job.model.js';

const QUEUE = 'notifications';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Mock provider that simulates network latency and random transient failure
async function mockProviderSend(job) {
  // Simulate external I/O latency
  await sleep(200 + Math.floor(Math.random() * 200));
  // Simulate 20% chance of transient failure
  if (Math.random() < 0.2) throw new Error('Transient provider error');
  return { providerMessageId: `mock-${Date.now()}` };
}

async function main() {
  if (!process.env.MONGO_URL || !process.env.RABBITMQ_URL) {
    console.error('MONGO_URL and RABBITMQ_URL must be set');
    process.exit(1);
  }

  // Connect DB
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Worker connected to MongoDB');

  // Connect Rabbit
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE, { durable: true });
  ch.prefetch(5); // limit concurrent deliveries per worker

  console.log('Worker waiting for messages...');

  ch.consume(QUEUE, async (msg) => {
    if (!msg) return;
    const content = JSON.parse(msg.content.toString());
    const { jobId } = content;

    const job = await Job.findOne({ jobId });
    if (!job) {
      // Acknowledge unknown job to avoid infinite loop
      ch.ack(msg);
      return;
    }

    try {
      job.status = 'processing';
      job.attempts += 1;
      job.logs.push({ level: 'info', message: `Processing attempt ${job.attempts}` });
      await job.save();

      // call provider
      const res = await mockProviderSend(job);

      job.status = 'delivered';
      job.logs.push({ level: 'info', message: `Delivered: ${JSON.stringify(res)}` });
      await job.save();

      ch.ack(msg);
    } catch (err) {
      console.error(`Job ${jobId} error:`, err.message);
      job.lastError = err.message;
      job.logs.push({ level: 'error', message: err.message });

      if (job.attempts < job.maxAttempts) {
        job.status = 'queued';
        await job.save();

        // Exponential backoff local re-publish (simple). In production use RabbitMQ dead-letter & TTL.
        const delayMs = Math.pow(2, job.attempts) * 1000;
        ch.ack(msg); // ack current
        setTimeout(() => {
          ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify({ jobId })), { persistent: true });
        }, delayMs);
      } else {
        job.status = 'failed';
        await job.save();
        ch.ack(msg);
      }
    }
  }, { noAck: false });
}

main().catch(err => {
  console.error('Worker fatal error', err);
  process.exit(1);
});
