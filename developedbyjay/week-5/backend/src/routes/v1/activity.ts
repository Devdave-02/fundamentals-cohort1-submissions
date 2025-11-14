import { createActivity } from "@src/controllers/v1/activity/createActivity";
import { deleteActivity } from "@src/controllers/v1/activity/deleteActivity";
import { getActivities } from "@src/controllers/v1/activity/getAllActivity";
import { updateActivity } from "@src/controllers/v1/activity/updateActivity";
import { authenticate } from "@src/middlewares/authentication";
import { authorization } from "@src/middlewares/authorization";
import { validationError } from "@src/middlewares/validate";
import express from "express";
import { body, param } from "express-validator";

const router = express.Router();

router.post(
  "/",
  body("type").trim().notEmpty().withMessage("Activity type is required"),
  body("duration").isInt().notEmpty().withMessage("Duration is required"),
  body("caloriesBurned")
    .isInt()
    .notEmpty()
    .withMessage("Calories Burned is required"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  createActivity
);

router.patch(
  "/:id",
  param("id").isMongoId().withMessage("invalid activity ID"),
  body("type")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Activity type is required"),
  body("duration")
    .optional()
    .isInt()
    .notEmpty()
    .withMessage("Duration is required"),
  body("caloriesBurned")
    .optional()
    .isInt()
    .notEmpty()
    .withMessage("Calories Burned is required"),
  validationError,
  authenticate,
  authorization(["admin", "user"]),
  updateActivity
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("invalid activity ID"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  deleteActivity
);

router.get("/", authenticate, authorization(["user", "admin"]), getActivities);

export default router
