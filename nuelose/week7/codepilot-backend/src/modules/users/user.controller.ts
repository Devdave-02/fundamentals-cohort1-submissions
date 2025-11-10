import { Request, Response, NextFunction } from "express";
import { createUserSchema, loginSchema } from "./user.schema";
import { createUserService } from "./user.service";
import { loginUser } from "./user.auth";
import prisma from "../../prisma/client";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const user = await createUserService(parsed.data);
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    if (error.message.includes("Email already exist")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.message });
    }
    const result = await loginUser(parsed.data);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) return res.status(400).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        orders: true,
      },
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
