import bcrypt from "bcrypt";

import type { Request, Response, NextFunction } from "express";

export const catchAsync =
  <P>(
    fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };


export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
