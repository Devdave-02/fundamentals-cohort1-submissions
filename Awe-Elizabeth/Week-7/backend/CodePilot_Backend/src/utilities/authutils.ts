// auth/helpers.ts
import mongoose, { Mongoose, ObjectId } from "mongoose";
import RefreshToken from "../models/RefreshToken";
import User, { IUser } from "../models/User";
import { Response } from "express";
import bcrypt from 'bcrypt'
import { decryptData, encryptData } from "./cryptoUtils";
import { token } from "morgan";

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCK_TIME_MINUTES = 30;

export async function registerFailedLogin(user: IUser) {
  const now = new Date();
  let message = "invalid credentials"
  user.invalidTries += 1;

  if (user.invalidTries >= MAX_FAILED_ATTEMPTS) {
    user.lockedTimeout = new Date(now.getTime() + LOCK_TIME_MINUTES * 60 * 1000);
    user.tokenValidity += 1;
    user.isLocked = true
    message = "Too many failed attempts. Please try again later"
    await user.save({validateBeforeSave: false});
    return message
  }

  await user.save({validateBeforeSave: false});
  return message
}

export async function resetFailedLogin(user: IUser) {

  user.invalidTries = 0;
  user.lockedTimeout = null;
  user.isLocked = false
  await user.save({validateBeforeSave: false});
}


export const createRefreshToken = async (user: IUser, refreshToken: string, res: Response) => {
  var encryptedHash =  encryptData(refreshToken)
    await RefreshToken.create({
      userId: user._id,
      tokenHash: encryptedHash,
      expiresAt: new Date(Date.now() + 30*24*60*60*1000),
      createdAt: Date.now()
    });
    user.refreshToken = encryptedHash
    await user.save({validateBeforeSave: false})


}