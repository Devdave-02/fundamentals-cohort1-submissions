import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// CPU-intensive function for baseline testing (Phase 1)
function cpuIntensiveTask(data) {
    console.log('Starting CPU-intensive task...');
    
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
    
    // Deep Fibonacci calculation to block event loop
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
        threadId: 'main-thread'
    };
}

// Unoptimized endpoint (Phase 1)
app.post('/api/process-data-unoptimized', (req, res) => {
    const startTime = Date.now();
    
    try {
        const result = cpuIntensiveTask(req.body);
        const endTime = Date.now();
        
        res.json({
            ...result,
            processingTime: endTime - startTime,
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: 'error'
        });
    }
});

// Optimized endpoint using Worker Threads (Phase 2)
app.post('/api/process-data', (req, res) => {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const worker = new Worker(join(__dirname, 'worker.js'), {
            workerData: req.body
        });
        
        worker.on('message', (result) => {
            const endTime = Date.now();
            worker.terminate();
            
            res.json({
                ...result,
                processingTime: endTime - startTime,
                status: 'success'
            });
            resolve();
        });
        
        worker.on('error', (error) => {
            worker.terminate();
            res.status(500).json({
                error: error.message,
                status: 'error'
            });
            reject(error);
        });
        
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: Date.now() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 Unoptimized endpoint: http://localhost:${PORT}/api/process-data-unoptimized`);
    console.log(`⚡ Optimized endpoint: http://localhost:${PORT}/api/process-data`);
    console.log(`\n📈 For profiling, run: npm run dev`);
    console.log(`📊 For CPU profiling, run: npm run profile`);
});
