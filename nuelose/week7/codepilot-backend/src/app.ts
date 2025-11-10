import * as dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

import express from "express";
import userModule from "./modules/users";
import productModule from "./modules/products";
import orderModule from "./modules/orders";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(productModule.path, productModule.router);
app.use(userModule.path, userModule.router);
app.use(orderModule.path, orderModule.router);

app.get("/", (req, res) => {
  res.status(201).json({ status: "okay", server: "codepilot" });
});
export default app;
