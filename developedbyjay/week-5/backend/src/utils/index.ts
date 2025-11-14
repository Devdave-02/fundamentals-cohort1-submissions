import type { Request, Response, NextFunction } from "express";

export const catchAsync =
  <P>(
    fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
