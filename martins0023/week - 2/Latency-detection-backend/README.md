## Latency Detective — Profiling & Optimization Report
Project
    - Challenge: Profiling and Performance Optimization (Node.js)

    - Date tested: 2025-10-03

    - Machine: Intel-core CPU, 8GB RAM, Node v20.10.0

    - Test harness: `autocannon` (100 concurrent requests)

## Phase 1 — Baseline Analysis (Unoptimized)
Endpoint tested: `POST /api/process-data (server-baseline.js)`

The baseline server was subjected to a load of **100 concurrent requests** using `autocannon`. The Event Loop was completely saturated by the synchronous CPU-intensive work.

**Initial average request latency (baseline):**

    - Example measured: 3942 ms (Approx. 3.94 seconds)

**Profiling Snapshot / CPU Profile (Baseline)**
The CPU profile captured during the load test clearly identifies the function responsible for blocking the Event Loop. We used the Bottom Up (heavy) profile from `node --prof` to find the CPU consumer.

**Top blocking function:** `fib()` (naive recursive Fibonacci)

From the screenshot:

* command (using `autocannon`): 
    ```
    # 100 concurrent connections for 20s
    npx autocannon -c 100 -d 20 -p 10 -m POST -H "content-type: application/json" -b '{"n":45}' http://localhost:3000/api/process-data
    ```

    ![alt text](<server-baseline - unoptimized.png>)

From the `processed - Unoptimized.txt` output:

  ```
Plaintext

  [Bottom up (heavy) profile]:
  ...
   ticks parent  name
  15734   68.9%  JS: *fib C:\\Users\\USER\\Desktop\\projects\\...\\server-baseline.js:10:13
  15734  100.0%    JS: *fib C:\\Users\\USER\\Desktop\\projects\\...\\server-baseline.js:10:13
  ...
  ```

**Observation**: The recursive fib function consumed 68.9% of the total sampled CPU ticks, and 96.5% of the total JavaScript execution time, confirming it as the sole bottleneck.

**Why it blocks**: The synchronous recursive calls of fib() run entirely on Node's single main thread. Since the function is CPU-intensive, it monopolizes the V8 engine, preventing the Event Loop from proceeding. This starves the application of the ability to register I/O callbacks, accept new connections, or send responses, causing massive latency under concurrent load.

## Phase 2 — Optimization (Worker Threads)
**Strategy:**
To resolve the synchronous block, the heavy computation was offloaded to a dedicated Worker `Thread`, isolating the CPU work from the main thread's Event Loop.

**Justification for Worker Threads:**
The application's core problem is a CPU-bound task (`fib()` and data processing).

    - Worker Threads are the definitive Node.js solution for this as they create separate OS threads with their own V8 instances and Event Loops, allowing the heavy work to run in parallel across multiple CPU cores without affecting the main thread.

    - Clustering was considered but rejected as the primary solution, as it is primarily designed to horizontally scale I/O-bound applications by distributing incoming connections to multiple processes. Using a Worker Thread is a more surgical fix to specifically offload the CPU task within the existing Express route.

**Implementation highlights:**

1. Main Thread (`server-worker.js`): The Express route now acts as a coordinator, spawning a new `Worker` instance for each incoming request, passing the data via the `workerData` option. It then uses a Promise wrapper to asynchronously wait for the result message.

2. Communication Strategy: Communication is handled via MessagePorts:

    - Main → Worker: Data is passed initially using the `workerData` object during instantiation.

    - Worker → Main: The worker script (worker.js) performs the `fib()` calculation and sends the final result back using `parentPort.postMessage(result)`.

3. Decoupling Confirmed: The main thread is now free to immediately return to the Event Loop after spawning the worker, drastically reducing Event Loop blockage.

## Phase 3 — Validation (Optimized)
**Endpoint tested**: `POST /api/process-data` (server-worker.js)

The optimized server was load-tested again with 100 concurrent requests.

**Final average request latency (optimized):**

- Example measured: 65 ms (A 60x+ improvement)

**Optimized CPU Profile**
The new CPU profile confirms that the CPU-intensive work has been successfully decoupled from the Main Thread.

From the screenshot:

* command (using `autocannon`): 
    ```
    # 100 concurrent connections for 20s
    npx autocannon -c 100 -d 20 -p 10 -m POST -H "content-type: application/json" -b '{"n":45}' http://localhost:3000/api/process-data
    ```

    ![alt text](<server - worker - optimized.png>)

From the `processed - optimized.txt` output:

  ```
Plaintext

  [Bottom up (heavy) profile]:
  ...
   ticks parent  name
   2417   96.2%  JS: *fib C:\Users\USER\Desktop\projects\brave-projects\engineering\latency-thread-worker\Latency-detection\worker.js:5:13
   2417  100.0%    JS: *fib C:\Users\USER\Desktop\projects\brave-projects\engineering\latency-thread-worker\Latency-detection\worker.js:5:13
   2417  100.0%      JS: *fib C:\Users\USER\Desktop\projects\brave-projects\engineering\latency-thread-worker\Latency-detection\worker.js:5:13
   2417  100.0%        JS: *fib C:\Users\USER\Desktop\projects\brave-projects\engineering\latency-thread-worker\Latency-detection\worker.js:5:13
   2417  100.0%          JS: *fib C:\Users\USER\Desktop\projects\brave-projects\engineering\latency-thread-worker\Latency-detection\worker.js:5:13
   2417  100.0%            JS: *fib C:\Users\USER\Desktop\projects\brave-projects\engineering\latency-thread-worker\Latency-detection\worker.js:5:13
  ...
  ```

**Observation**: The recursive fib() function no longer appears in the Main Thread's call stack. The time spent in the Main Thread is primarily dedicated to HTTP I/O, setting up the Worker thread, and asynchronously processing the final on('message') callback. This is the intended behavior, demonstrating that the main thread is now responsive and unblocked.

**Percent Improvement in Latency**
The optimization yielded a massive gain in responsiveness and throughput under load.

`Improvement Percentage= 
Initial Latency
(Initial Latency−Final Latency)
​
 ×100
Improvement Percentage= 
3942 ms
(3942 ms−65 ms)
​
 ×100≈98.35%`
The system latency improved by over **98%**.

## Additional Notes, Trade-offs & Future Improvements
    - Worker-per-Request Trade-Off (Cost of Spawning): The current implementation spawns a new Worker Thread for every incoming request. While effective for demonstration, the overhead of thread creation and tear-down can become a bottleneck under extreme load.

    - Future Improvement: Worker Pooling: For a production-ready system, a Worker Pool is recommended. This involves maintaining a fixed number of long-lived Worker Threads (typically equal to the number of CPU cores) and using a queueing mechanism to dispatch tasks to idle workers. This eliminates the thread creation overhead.

    - Data Transfer Cost: Passing data to the worker (like the large JSON payload) involves an initial data copy. For massive datasets, exploring Transferable objects (like ArrayBuffer) or SharedArrayBuffer for true shared memory would further reduce communication overhead.

    - Observability: Future monitoring should focus on Event Loop Lag on the main thread and CPU Utilization on the worker threads to ensure the system remains balanced and responsive.

## Reproducible Scripts

    — start baseline server
    
    node server-baseline.js 
    

    — start optimized server
    
    node server-worker.js 
    

    - Load testing (autocannon)
    
    npx autocannon -c 100 -d 20 -p 10 -m POST -H "content-type: application/json" -b '{"n":45}' http://localhost:3000/api/process-data
    

    Profiling:

    node --prof server-baseline.js

    
    node --prof server-worker.js

    When process exits, Node produces a isolate-*.log file.
    - To process it:

    node --prof-process isolate-*.log > processed.txt
    
    *Inspect processed.txt for top CPU-consuming functions*


## Artifacts
1. server-baseline.js and server-worker.js (unoptimized and optimized)

2. worker.js (committed)

3. frontend/ (client)

4. README.md (this file updated with actual numbers and screenshots)

5. CPU profiles / flamegraphs (PNG) and processed `node --prof output`

6. Logs: <a href="https://github.com/martins0023/latency-detection/blob/main/processed-optimized-log.txt">processed-optimized-log.txt</a> and <a href="https://github.com/martins0023/latency-detection/blob/main/processed-unoptimized-log.txt">processed-unoptimized-log.txt</a>