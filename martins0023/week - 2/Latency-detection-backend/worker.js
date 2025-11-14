// worker.js
const { parentPort } = require('worker_threads');

// same heavy functions as baseline
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

function processDataSync(payload) {
  let large = JSON.stringify({ arr: new Array(10000).fill(payload) });
  for (let i = 0; i < 10; i++) {
    large = JSON.parse(JSON.stringify(large));
  }
  const n = (payload && payload.n) || 42;
  const result = fib(n);
  return { result, n };
}

parentPort.on('message', (payload) => {
  const start = Date.now();
  try {
    const out = processDataSync(payload);
    const elapsed = Date.now() - start;
    parentPort.postMessage({ ok: true, elapsedMs: elapsed, out });
  } catch (err) {
    parentPort.postMessage({ ok: false, error: err.message || String(err) });
  }
});
