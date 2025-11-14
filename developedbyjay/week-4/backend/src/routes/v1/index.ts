import { Router } from "express";
import authRoute from "@routes/v1/auth";
import userRoute from "@routes/v1/user";
import postRoute from "@routes/v1/post";
import commentRoute from "@routes/v1/comment";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    // docs
  });
});

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/posts", postRoute);
router.use("/comments", commentRoute);

export { router };
