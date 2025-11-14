import { Doctor } from "@src/models/doctor";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, specialty, contactInfo, appointments } = req.body;

    const doctor = await Doctor.create({
      name,
      specialty,
      contactInfo,
      appointments: appointments && appointments.length > 0 ? appointments : [],
    });

    return res.status(201).json({
      status: "success",
      message: "Doctor created successfully",
      data: doctor,
    });
  }
);
