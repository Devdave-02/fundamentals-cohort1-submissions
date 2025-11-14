import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { logger } from './config/logger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './api/index.js';

const app = express();

// --- Core Middleware ---

// Enable CORS - Adjust origin for your frontend's URL in production
app.use(cors({ origin: 'https://flowserve-frontend.vercel.app', credentials: true }));

// Set various security HTTP headers
app.use(helmet());

// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// --- Logging ---

// Add pino-http logger for HTTP requests
app.use(pinoHttp({ logger }));

// --- Rate Limiting ---

// Apply rate limiting to all API routes
app.use('/api', rateLimiter);

// --- API Routes ---

// Mount the main API router
app.use('/api/v1', apiRouter);

// --- Health Check ---

// A simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'FlowServe API is healthy' });
});

// --- Error Handling ---

// Global error handler (must be the LAST middleware)
app.use(errorHandler);

export { app };
