import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import productsRoutes from "./modules/products/products.routes";
import ordersRoutes from "./modules/orders/orders.routes";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your React dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

export default app;
