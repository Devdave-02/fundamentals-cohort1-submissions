const app = require('./app');

// Use 3001 to avoid conflicts with frontend (which often uses 3000)
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`CodePilot server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = server;