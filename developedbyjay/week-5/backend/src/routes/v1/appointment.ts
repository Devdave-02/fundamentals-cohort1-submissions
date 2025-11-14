import { createAppointment } from "@src/controllers/v1/appointment/createAppointment";
import { deleteAppointment } from "@src/controllers/v1/appointment/deleteAppointment";
import { getAppointments } from "@src/controllers/v1/appointment/getAllAppointment";
import { updateAppointment } from "@src/controllers/v1/appointment/updateAppointment";
import { authenticate } from "@src/middlewares/authentication";
import { authorization } from "@src/middlewares/authorization";
import { validationError } from "@src/middlewares/validate";
import express from "express";
import { body, param } from "express-validator";

const router = express.Router();

router.post(
  "/",
  body("doctorId").isMongoId().withMessage("Invalid doctorId"),
  body("date").isISO8601().notEmpty().withMessage("Date is required"),
  body("reason").trim().notEmpty().withMessage("Date is required"),
  body("reports")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Report must not be empty"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  createAppointment
);

router.patch(
  "/:id",
  param("id").isMongoId().withMessage("invalid activity ID"),
  body("doctorId").optional().isMongoId().withMessage("Invalid doctorId"),
  body("date")
    .optional()
    .isISO8601()
    .notEmpty()
    .withMessage("Date is required"),
  body("reason").optional().trim().notEmpty().withMessage("Date is required"),
  body("reports")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Report must not be empty"),
  validationError,
  authenticate,
  authorization(["admin", "user"]),
  updateAppointment
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("invalid Appointment ID"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  deleteAppointment
);

router.get(
  "/",
  authenticate,
  authorization(["user", "admin"]),
  getAppointments
);
export default router;
