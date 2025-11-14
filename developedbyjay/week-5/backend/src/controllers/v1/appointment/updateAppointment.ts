import { AppError } from "@src/lib/appError";
import { Appointment } from "@src/models/appointment";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const updateAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const userId = req.userId;
    const appointment = await Appointment.findOne({
      _id,
      userId,
    });

    if (!appointment) return next(new AppError("Appointment not found", 404));

    Object.assign(appointment, req.body);

    const updatedAppointment = await appointment.save();

    return res.status(200).json({
      status: "success",
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  }
);
