import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { transactionRouter } from "./transaction.route";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API v1 is Live",
    status: "success",
    v1: "1.0.0",
    timeStamp: new Date().toISOString(),
  });
});

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/transaction", transactionRouter);

export { router };
