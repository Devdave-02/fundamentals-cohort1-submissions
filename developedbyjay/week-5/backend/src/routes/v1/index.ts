import { Router } from "express";
import authRoute from "@routes/v1/auth";
import userRoute from "@routes/v1/user";
import appointmentRoute from "@routes/v1/appointment";
import activityRoute from "@routes/v1/activity";
import doctorRoute from "@routes/v1/doctor";

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
router.use("/appointment", appointmentRoute);
router.use("/activity", activityRoute);
router.use("/doctor", doctorRoute);

export { router };
