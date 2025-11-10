import { Request, Response } from "express";
import * as service from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await service.registerUser(email, password);
    return res
      .status(201)
      .json({ user: { id: user._id, email: user.email }, token });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await service.loginUser(email, password);
    return res.send({ user: { id: user._id, email: user.email }, token });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
