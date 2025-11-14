import { Router } from "express";
const router = Router();

router.get("/", async (_req, res) => {
  const status = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  };
  res.json(status);
});

export default router;
