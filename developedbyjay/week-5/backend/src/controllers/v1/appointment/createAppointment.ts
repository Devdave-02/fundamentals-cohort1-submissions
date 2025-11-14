import { AppError } from "@src/lib/appError";
import { Appointment } from "@src/models/appointment";
import { Doctor } from "@src/models/doctor";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const createAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { doctorId, date, reason, reports } = req.body;

    const doctor = await Doctor.findOne({ _id: doctorId }).lean().exec();
    if (!doctor) return next(new AppError("Doctor not found", 404));

    const appointment = await Appointment.create({
      userId,
      doctorId,
      date,
      reason,
      reports: reports && reports.length > 0 ? reports : [],
    });

    return res.status(201).json({
      status: "success",
      message: "Appointment created successfully",
      data: appointment,
    });
  }
);
