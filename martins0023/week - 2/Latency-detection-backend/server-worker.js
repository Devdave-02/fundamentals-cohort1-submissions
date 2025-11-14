// server-worker.js
const express = require('express');
const bodyParser = require('body-parser');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Spawn a worker for each incoming request and wrap in a Promise
function runWorker(payload) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, 'worker.js');
    const worker = new Worker(workerPath);
    const startedAt = Date.now();

    worker.on('message', (msg) => {
      // msg: { ok: true, elapsedMs, out } or { ok: false, error }
      worker.terminate();
      if (msg && msg.ok) {
        resolve({ ...msg, totalRoundtripMs: Date.now() - startedAt });
      } else {
        reject(new Error(msg && msg.error ? msg.error : 'Unknown worker error'));
      }
    });

    worker.on('error', (err) => {
      worker.terminate();
      reject(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        // Non-zero exit code might have been handled by 'error', but just in case:
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    // Send the payload to worker
    worker.postMessage(payload);
  });
}

app.post('/api/process-data', async (req, res) => {
  const payload = req.body || {};
  const start = Date.now();
  try {
    const workerResult = await runWorker(payload);
    const totalElapsed = Date.now() - start;
    return res.json({ ok: true, workerResult, totalElapsedMs: totalElapsed });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Worker server listening on ${port}`));
