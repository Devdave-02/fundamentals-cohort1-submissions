import { Appointment } from "@src/models/appointment";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const getAppointments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const appointments = await Appointment.find({ userId })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Appointments fetched successfully",
      data: appointments,
    });
  }
);
