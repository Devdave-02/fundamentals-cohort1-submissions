import { Appointment } from "@src/models/appointment";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const deleteAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const userId = req.userId;

    await Appointment.findOneAndDelete({
      _id,
      userId,
    });
    return res.status(204).json({
      status: "success",
      message: "Appointment deleted successfully",
    });
  }
);
