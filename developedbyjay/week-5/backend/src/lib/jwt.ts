import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Response } from "express";
import { TokenPayload } from "@src/utils/types";

export const generateAccessToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1hr",
    subject: "accessToken",
  });
  return token;
};

export const generateTokens = async (
  userId: Types.ObjectId,
  res: Response
): Promise<{ accessToken: string }> => {
  const accessToken = generateAccessToken({ userId });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return { accessToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};
