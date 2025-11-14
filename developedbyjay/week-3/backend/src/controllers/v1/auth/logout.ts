import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@lib/appError";
import { User } from "@src/models/user";
import { Blacklist } from "@src/models/blacklist";

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.userId;

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    const user = await User.findById(userId).exec();

    const checkTokenAlreadyBlacklisted = await Blacklist.findOne({
      refreshToken: user!.passwordRefreshToken,
    }).exec();
    
    if (!checkTokenAlreadyBlacklisted) {
      await Blacklist.create({
        refreshToken: user!.passwordRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    user!.passwordRefreshToken = "";
    await user!.save();

    res.status(204).send();
  }
);
export { logout };
