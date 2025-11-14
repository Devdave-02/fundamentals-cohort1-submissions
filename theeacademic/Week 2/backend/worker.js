import { parentPort, workerData } from 'worker_threads';

// CPU-intensive function moved to worker thread
function cpuIntensiveTask(data) {
    console.log('Worker: Starting CPU-intensive task...');
    
    // Simulate heavy JSON processing
    const largeObject = {};
    for (let i = 0; i < 10000; i++) {
        largeObject[`key_${i}`] = {
            id: i,
            data: Math.random().toString(36).substring(7),
            nested: {
                value: Math.floor(Math.random() * 1000),
                timestamp: Date.now()
            }
        };
    }
    
    // Deep Fibonacci calculation to demonstrate CPU work
    function fibonacci(n) {
        if (n < 2) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    // Calculate multiple Fibonacci numbers to create significant CPU load
    const results = [];
    for (let i = 35; i <= 42; i++) {
        results.push(fibonacci(i));
    }
    
    // Additional heavy computation
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += Math.sqrt(i) * Math.sin(i);
    }
    
    return {
        processedData: data,
        fibonacciResults: results,
        computedSum: sum,
        timestamp: Date.now(),
        threadId: 'worker-thread'
    };
}

// Process the data and send result back to main thread
try {
    const result = cpuIntensiveTask(workerData);
    parentPort.postMessage(result);
} catch (error) {
    parentPort.postMessage({ error: error.message });
}
