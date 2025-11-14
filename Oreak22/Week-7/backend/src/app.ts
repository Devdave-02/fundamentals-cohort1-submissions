import express from "express";
import cors from "cors";
import authRoutes from "./routers/auth.routes";
import productsRoutes from "./routers/products.routes";
import ordersRoutes from "./routers/orders.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

app.get("/", (req, res) => res.send({ ok: true }));

export default app;
