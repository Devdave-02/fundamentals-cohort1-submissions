import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequests = async (endpoint, concurrentRequests = 100) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const startTime = Date.now();
    const requests = [];
    
    // Create test data
    const testData = {
      message: 'Performance test data',
      timestamp: Date.now(),
      iterations: Math.floor(Math.random() * 1000) + 500
    };

    console.log(`🚀 Starting ${concurrentRequests} concurrent requests to ${endpoint}`);

    // Create all requests simultaneously
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(
        axios.post(`${API_BASE_URL}${endpoint}`, {
          ...testData,
          requestId: i + 1
        }).catch(err => ({
          error: err.message,
          requestId: i + 1,
          processingTime: 0
        }))
      );
    }

    try {
      // Wait for all requests to complete
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Process results
      const successfulRequests = responses.filter(r => !r.error);
      const failedRequests = responses.filter(r => r.error);

      const processingTimes = successfulRequests.map(r => r.data.processingTime);
      const averageLatency = processingTimes.length > 0 
        ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
        : 0;

      const minLatency = processingTimes.length > 0 ? Math.min(...processingTimes) : 0;
      const maxLatency = processingTimes.length > 0 ? Math.max(...processingTimes) : 0;

      const result = {
        totalRequests: concurrentRequests,
        successfulRequests: successfulRequests.length,
        failedRequests: failedRequests.length,
        successRate: ((successfulRequests.length / concurrentRequests) * 100).toFixed(2),
        totalTestTime: totalTime,
        averageLatency: Math.round(averageLatency),
        minLatency,
        maxLatency,
        requestsPerSecond: Math.round((concurrentRequests / totalTime) * 1000),
        endpoint: endpoint,
        sampleResponse: successfulRequests[0]?.data || null,
        errors: failedRequests.map(r => r.error).slice(0, 5) // Show first 5 errors
      };

      setResults(result);
      console.log('📊 Test Results:', result);
    } catch (err) {
      setError(`Test failed: ${err.message}`);
      console.error('❌ Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>🕵️ Latency Detective</h1>
      <h2>Node.js Performance Optimization Challenge</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => sendRequests('/api/process-data-unoptimized', 100)}
          disabled={loading}
          style={{ backgroundColor: '#ff6b6b' }}
        >
          {loading ? <span className="loading"></span> : '🧪'} Test Unoptimized Endpoint (100 req)
        </button>
        
        <button 
          onClick={() => sendRequests('/api/process-data', 100)}
          disabled={loading}
          style={{ backgroundColor: '#4ecdc4' }}
        >
          {loading ? <span className="loading"></span> : '⚡'} Test Optimized Endpoint (100 req)
        </button>
      </div>

      {loading && (
        <div className="status running">
          🔄 Running load test... Please wait while we send 100 concurrent requests.
        </div>
      )}

      {error && (
        <div className="status error">
          ❌ {error}
        </div>
      )}

      {results && (
        <div className="results">
          <h3>📊 Performance Test Results</h3>
          <div className="metric">
            <span className="metric-label">Endpoint:</span>
            <span className="metric-value">{results.endpoint}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Total Requests:</span>
            <span className="metric-value">{results.totalRequests}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Successful Requests:</span>
            <span className="metric-value">{results.successfulRequests}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Failed Requests:</span>
            <span className="metric-value">{results.failedRequests}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Success Rate:</span>
            <span className="metric-value">{results.successRate}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Total Test Time:</span>
            <span className="metric-value">{results.totalTestTime}ms</span>
          </div>
          <div className="metric">
            <span className="metric-label">Average Latency:</span>
            <span className="metric-value">{results.averageLatency}ms</span>
          </div>
          <div className="metric">
            <span className="metric-label">Min Latency:</span>
            <span className="metric-value">{results.minLatency}ms</span>
          </div>
          <div className="metric">
            <span className="metric-label">Max Latency:</span>
            <span className="metric-value">{results.maxLatency}ms</span>
          </div>
          <div className="metric">
            <span className="metric-label">Requests/Second:</span>
            <span className="metric-value">{results.requestsPerSecond}</span>
          </div>
          
          {results.errors.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4>⚠️ Sample Errors:</h4>
              {results.errors.map((error, index) => (
                <div key={index} style={{ color: '#ff6b6b', fontSize: '0.9em' }}>
                  {error}
                </div>
              ))}
            </div>
          )}

          {results.sampleResponse && (
            <div style={{ marginTop: '1rem' }}>
              <h4>📄 Sample Response:</h4>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1rem', 
                borderRadius: '5px',
                fontSize: '0.8em',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(results.sampleResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', fontSize: '0.9em', opacity: 0.7 }}>
        <p>💡 <strong>Instructions:</strong></p>
        <p>1. Start the backend server: <code>cd latency-detective-backend && npm install && npm start</code></p>
        <p>2. Test the unoptimized endpoint first to establish baseline performance</p>
        <p>3. Test the optimized endpoint to see the improvement with Worker Threads</p>
        <p>4. Compare the average latency between both tests</p>
      </div>
    </div>
  );
}

export default App;
