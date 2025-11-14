# Performance Optimization Report

This report documents the performance optimization of my express application focusing on improving request latency by addressing Event Loop blocking issues.

## Baseline Analysis (Unoptimized)

### Initial Performance Metrics

- Average Request Latency: 7022.68ms
- Status: Significant Event Loop blocking detected

### CPU Profile Analysis

![Unoptimized CPU Profile](https://github.com/developedbyjay/project-optimization/raw/main/images/Unoptimized-result.png)

- The blocking function identified in the CPU profile clearly shows the performance bottleneck:
- The blocking function named "fib" is in the utils.ts file.

![Blocking Function Part 1](https://github.com/developedbyjay/project-optimization/raw/main/images/Blocking-function-1.png)
![Blocking Function Part 2](https://github.com/developedbyjay/project-optimization/raw/main/images/Blocking-function-2.png)

## Optimization Strategy

### Event Loop Blocking Analysis

The event loop was blocked because the CPU-intensive function (recursive Fibonacci calculation) was running synchronously on the main thread. Since Node.js is single-threaded by default, this heavy computation monopolized the main thread, preventing it from processing incoming I/O requests efficiently. This led to high latency, timeouts, and reduced throughput under load testing.

### Why Worker Threads?

Worker Threads were chosen because they allow CPU-bound tasks to run in parallel threads without blocking the event loop. Unlike clustering, which spawns multiple processes each with its own event loop and memory space, Worker Threads share memory with the main thread and enable finer-grained parallelism. This makes them more suitable for offloading expensive computations while maintaining a single, centralized Express server for I/O handling.

### Communication Strategy

The main thread and worker threads communicate via message passing. When a request arrives:

1. The main thread assigns a worker from a pool
2. Input data is sent using `worker.postMessage()`
3. The worker performs the computation
4. Results are returned via `parentPort.postMessage()`
5. The main thread listens for the result, resolves the Promise, and sends the response back to the client

This asynchronous, event-driven communication ensures non-blocking coordination between threads.

## Validation Results (Optimized)

### Final Performance Metrics

- Initial Average Latency: 7022.68ms
- Final Average Latency: 692.5ms
- **Performance Improvement: 90.14%** (Calculation: (7022.68ms - 692.5ms) / 7022.68ms \* 100)

### Optimized CPU Profile

![Optimized CPU Profile](https://github.com/developedbyjay/project-optimization/raw/main/images/Optimized-result.png)

The optimized CPU profile demonstrates a significant reduction in main thread utilization, with heavy calculations now distributed across worker threads.

## Conclusion

The implementation of Worker Threads successfully resolved the Event Loop blocking issues, resulting in a dramatic 90.14% reduction in average request latency. This improvement demonstrates the effectiveness of moving CPU-intensive operations off the main thread while maintaining the application's functionality.
