import app from "./app";
import logger from "./lib/logger";

const port = Number(process.env.PORT || 3000);

const server = app.listen(port, () => {
  logger.info(`Server listening on ${port}`);
});

// graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down");
  server.close(() => process.exit(0));
});
