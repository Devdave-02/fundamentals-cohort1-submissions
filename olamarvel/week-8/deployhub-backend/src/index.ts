import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import { connectDB } from "./config/db";
import activityRoutes from "./Routes/activities";
import appointmentRoutes from "./Routes/appointments";
import authRoutes from "./Routes/auth";
import doctorRoutes from "./Routes/doctor";
import { errorHandler } from "./Middlewares/error";
import logger from "./util/logger";
import { requestTimingMiddleware, register, appUptimeGauge } from './util/metrics';


const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://pluse-track-frontend.vercel.app",
];

app.use(requestTimingMiddleware)

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);


    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is allowed for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/activities", activityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes)
app.use("/health-check", (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
})
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

appUptimeGauge.set({ service: 'backend' }, process.uptime());


app.use((req, res) => {
  logger.info('not found', { path: req.path });
  res.status(404).send({ error: 'Not found' });
});

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/pulsetrack")
  .then(() => {
    app.listen(PORT, () => logger.info(`Server running on ${PORT}`));
  })
  .catch(err => {
    logger.error("DB connection failed", err);
  });
