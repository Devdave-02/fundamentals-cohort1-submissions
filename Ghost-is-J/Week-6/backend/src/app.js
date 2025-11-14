import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {userRouter} from "./routes/userRoutes.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {logger} from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use("/api/users", userRouter);

app.use(errorHandler);

export default app;