import { getChannel, QUEUE_NAME } from '../config/rabbitmq.js';

export function publishJob(jobId) {
  const channel = getChannel();
  const payload = Buffer.from(JSON.stringify({ jobId }));
  // persistent message ensures the message survives broker restart
  channel.sendToQueue(QUEUE_NAME, payload, { persistent: true });
}
