import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Response } from "express";
import { TokenPayload } from "@src/utils/types";
import { User } from "@src/models/user";

export const generateAccessToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1hr",
    subject: "accessToken",
  });
  return token;
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7days",
    subject: "refreshToken",
  });
  return token;
};

export const generateTokens = async (
  userId: Types.ObjectId,
  res: Response
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = generateAccessToken({ userId });
  const refreshToken = generateRefreshToken({ userId });

  const user = await User.findById(userId);

  if (user) {
    user.passwordRefreshToken = refreshToken;
    await user.save();
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};
