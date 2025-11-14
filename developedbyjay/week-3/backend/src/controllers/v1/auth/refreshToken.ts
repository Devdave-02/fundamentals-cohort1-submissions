import { Types } from "mongoose";
import { AppError, catchAsync } from "@lib/appError";
import { generateAccessToken, verifyRefreshToken } from "@lib/jwt";
import type { NextFunction, Request, Response } from "express";
import { Blacklist } from "@src/models/blacklist";
import { TokenPayload } from "@src/utils/types";

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken } = req.cookies as { refreshToken: string };

    if (!refreshToken) {
      return next(new AppError("AuthenticationError, No Refresh Token", 401));
    }

    const checkTokenValid = await Blacklist.findOne({ refreshToken }).exec();

    if (checkTokenValid) {
      return next(
        new AppError("Token is blacklisted. Please login again.", 401)
      );
    }
    const { userId } = verifyRefreshToken(refreshToken) as TokenPayload;

    const accessToken = generateAccessToken({ userId });

    if (accessToken)
      await Blacklist.create({
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    res.status(200).json({
      message: "Access Token Generated Successfully",
      accessToken,
    });
  }
);

export { refreshToken };
