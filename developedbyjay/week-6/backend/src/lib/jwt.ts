import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateAccessToken = (payload: { userId: string }): string => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1hr",
    subject: "accessToken",
  });
  return token;
};

export const generateTokens = async (
  userId: string,
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
