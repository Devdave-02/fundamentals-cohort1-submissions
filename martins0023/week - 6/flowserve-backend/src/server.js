import dotenv from 'dotenv';
import { app } from './app.js';
import { logger } from './config/logger.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
