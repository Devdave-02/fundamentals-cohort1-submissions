import { Doctor } from "@src/models/doctor";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const getDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctors = await Doctor.find({});

    res.status(200).json({
      status: "success",
      message: "Doctors fetched successfully",
      data: doctors,
    });
  }
);
