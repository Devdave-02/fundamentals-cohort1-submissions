# 🔍 Performance Profiling Guide

## Chrome DevTools Profiling

### Setup
1. Start the backend server with profiling enabled:
   ```bash
   npm run dev
   ```

2. Open Chrome and navigate to `chrome://inspect`

3. Click "inspect" under your Node.js process

4. Go to the **Performance** tab

### Capturing Profiles

#### For Unoptimized Endpoint
1. Start recording in Chrome DevTools Performance tab
2. Run the frontend load test on unoptimized endpoint
3. Stop recording after test completes
4. Analyze the flame graph to identify blocking functions

#### For Optimized Endpoint
1. Start recording in Chrome DevTools Performance tab
2. Run the frontend load test on optimized endpoint
3. Stop recording after test completes
4. Compare with unoptimized profile

### Key Metrics to Look For
- **Main Thread Blocking**: Look for long yellow bars in the flame graph
- **Event Loop Utilization**: Check if main thread is free during worker execution
- **CPU Usage**: Compare CPU consumption between profiles
- **Function Call Times**: Identify which functions consume most time

## Command Line Profiling

### CPU Profiling
```bash
# Start server with CPU profiling
npm run profile

# Run load test, then stop server
# Generate profile report
node --prof-process isolate-*.log > profile-report.txt
```

### Memory Profiling
```bash
# Start with heap profiling
node --inspect --inspect-brk=0.0.0.0:9229 server.js

# Use Chrome DevTools Memory tab for heap snapshots
```

## Interpreting Results

### Unoptimized Profile
- **Expected**: Long main thread blocking periods
- **Fibonacci Function**: Should show high CPU usage
- **Event Loop**: Blocked during computation

### Optimized Profile
- **Expected**: Short main thread usage
- **Worker Threads**: Separate thread activity visible
- **Event Loop**: Free for I/O operations

## Performance Benchmarks

### Baseline Targets
- **Unoptimized Latency**: 3,000-4,000ms average
- **CPU Utilization**: 90%+ on main thread
- **Event Loop Blocking**: Continuous during requests

### Optimization Targets
- **Optimized Latency**: <100ms average
- **CPU Utilization**: <20% on main thread
- **Event Loop Blocking**: Minimal

## Troubleshooting

### Common Issues
1. **Profiler Not Connecting**: Check firewall and port 9229
2. **No Performance Data**: Ensure sufficient test duration
3. **Inconsistent Results**: Run multiple tests for averages

### Best Practices
- Run tests multiple times for consistent results
- Use same test data for fair comparison
- Monitor system resources during testing
- Document environment conditions
