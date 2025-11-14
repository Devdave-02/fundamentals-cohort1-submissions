import { createDoctor } from "@src/controllers/v1/doctor/createDoctor";
import { getDoctors } from "@src/controllers/v1/doctor/getAllDoctors";
import { authenticate } from "@src/middlewares/authentication";
import { authorization } from "@src/middlewares/authorization";
import { validationError } from "@src/middlewares/validate";
import express from "express";
import { body, param } from "express-validator";

const router = express.Router();

router.post(
  "/",
  body("name").trim().notEmpty().withMessage("Doctor name is required"),
  body("specialty").trim().notEmpty().withMessage("Specialty is required"),
  body("contactInfo")
    .trim()
    .notEmpty()
    .withMessage("contactInfo must not be empty"),
  body("appointments")
    .optional()
    .isArray({ min: 1 })
    .notEmpty()
    .withMessage("Appointments is required"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  createDoctor
);

// router.patch(
//   "/:id",
//   param("id").isMongoId().withMessage("invalid doctor ID"),
//   body("name").optional().trim().notEmpty().withMessage("Doctor name is required"),
//   body("specialty").optional().trim().notEmpty().withMessage("Specialty is required"),
//   body("contactInfo").optional()
//     .trim()
//     .notEmpty()
//     .withMessage("contactInfo must not be empty"),
//   body("appointments")
//     .optional()
//     .isArray({ min: 1 })
//     .notEmpty()
//     .withMessage("Appointments is required"),
//   validationError,
//   authenticate,
//   authorization(["admin"]),
//   updateDoctor
// );

// router.delete(
//   "/:id",
//   param("id").isMongoId().withMessage("invalid Doctor ID"),
//   validationError,
//   authenticate,
//   authorization(["admin"]),
//   deleteDoctor
// );

router.get("/", authenticate, authorization(["user", "admin"]), getDoctors);

export default router;
