import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import authRoutes from './routes/AuthRoutes'
import productRoutes from './routes/productRoutes'
import orderRoutes from './routes/orderRoutes'
import { errorHandler } from './middleware/errorHandlerMiddleware';


const app  = express();


//midleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser())
//app.use(helmet())

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);


app.use(errorHandler)
export default app;