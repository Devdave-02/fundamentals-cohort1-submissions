// server-baseline.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Synchronous heavy function (blocking)
// naive fibonacci (exponential time) as a CPU-heavy stand-in
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// This simulates heavy JSON parsing + CPU work on main thread
function processDataSync(payload) {
  // Artificial heavy JSON work: stringify/parse a large data piece many times
  let large = JSON.stringify({ arr: new Array(10000).fill(payload) });
  for (let i = 0; i < 10; i++) {
    // repeated parse/stringify loop
    large = JSON.parse(JSON.stringify(large));
  }
  // heavy CPU calculation (tunable via payload.n)
  const n = (payload && payload.n) || 42;
  const result = fib(n);
  return { result, n };
}

app.post('/api/process-data', (req, res) => {
  const payload = req.body || {};
  const start = Date.now();
  const out = processDataSync(payload);
  const elapsed = Date.now() - start;
  res.json({ ok: true, elapsedMs: elapsed, out });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Baseline server listening on ${port}`));
