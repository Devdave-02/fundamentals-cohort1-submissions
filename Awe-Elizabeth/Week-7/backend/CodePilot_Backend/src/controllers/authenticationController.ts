import mongoose from "mongoose"
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import {UserRoles} from '../utilities/enums/UserRole'
import { generateToken } from "../utilities/jwt";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken";
import bcrypt from 'bcrypt'
import { createRefreshToken, registerFailedLogin, resetFailedLogin } from "../utilities/authutils";
import dotenv, { decrypt } from "dotenv";
import { decryptData, encryptData } from "../utilities/cryptoUtils";
import asyncHandler from "../utilities/asyncHandler";
dotenv.config()



export const Register = asyncHandler( async (req: Request, res: Response) => {

  const { email, password, firstName, lastName, role } = req.body;

  if(!email || !password || !firstName || !lastName){
    return res.status(400).json({ message: "all fields are required"});
  }

  if(password.length < 8){
    return res.status(400).json({ message: "password must be at least eight characters"});
  }
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    role: role || UserRoles.User, // default to User,
    tokenValidity: 1
  });
  await user.save();
  return res.status(201).json({
    success: true,
    message: "successful"
  });
})

export const Login =async (req: Request, res: Response) => {
   try {
    const { email, password } = req.body;
    let refreshToken : string = "";
    if(!email || !password){
      return res.status(400).json({ message: "all fields are required"});
    }
    const user = await User.findOne({email})

    if(!user){
      return res.status(401).json({ message: "invalid credentials"});
    }

    if(user.isLocked && user.lockedTimeout && user.lockedTimeout.getTime() > Date.now()){
      const retryAfterMs = user.lockedTimeout.getTime() - Date.now();
      return res.status(403).json({ message: `Your account is temporarily locked, please retry in ${Math.ceil(retryAfterMs/60000)} mins`});
    }

    const valid = await user.comparePassword(password)
    if(!valid){
     let failedLoginRes = await registerFailedLogin(user)
      return res.status(401).json({message: failedLoginRes})
    }
    await resetFailedLogin(user)

    const token = jwt.sign({id: user._id, email: user.email, tokenValidity: user.tokenValidity, role: user.role}, process.env.JWT_SECRET!, {expiresIn: "15min"});

    //if stored refreshToken is empty of has expired
    if(!user.refreshToken || !jwt.verify(decryptData(user.refreshToken), process.env.JWT_SECRET!)){
      refreshToken = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: "30d"});;
      await createRefreshToken(user, refreshToken, res)
    }else{
      refreshToken = await decryptData(user.refreshToken)
    }

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge:  30*24*60*60*1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
    })
    
    return res.status(200).json({
      success: true,
      message: "success",
      result: { 
        accessToken: token,
        refreshToken : refreshToken
        },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No token provided" });
  
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const record = await RefreshToken.findOne({ userId: payload.id, revoked: false }, null, { sort: { createdAt: -1 }});

    if (!record) return res.status(401).json({ message: "Invalid token" });
    const match = token === decryptData(record.tokenHash)
    if (!match) return res.status(403).json({ message: "Invalid token" });
    const user = await User.findById(payload.id)
    if(!user) return res.status(404).json({ message: "Not Found" });

    const newAccess = jwt.sign({ id: user._id, email: user.email, tokenValidity: user.tokenValidity + 1, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const newRefresh = jwt.sign({id: payload.id}, process.env.JWT_SECRET!, { expiresIn: "30d" });

    const ecrypted = encryptData(newRefresh);
    record.tokenHash =  ecrypted
    record.expiresAt = new Date(Date.now() + 30*24*60*60*1000);
    await record.save();
   
    user.refreshToken = ecrypted
    user.tokenValidity += 1
    await user.save({validateBeforeSave: false})

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      maxAge: 30*24*60*60*1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    })

    return res.status(200).json({
      success: true,
      message: "success",
      result: { 
        accessToken: newAccess,
        refreshToken : newRefresh
        },
    });

  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  var token = req.cookies?.refreshToken  
  if(!token)
    return res.status(401).json({ message: "No token provided" });

  const encryptedToken= encryptData(token);

  let refreshTokenData = await RefreshToken.findOne({tokenHash: encryptedToken});

  if(!refreshTokenData) return res.status(404).json({ message: "token not found" });

  const user = await User.findOne({refreshToken: encryptedToken});
  if(!user) return res.status(404).json({ message: "user not found" });
  user.refreshToken = ''
  user.tokenValidity += 1 

  await user?.save();

  refreshTokenData.revoked = true
  await refreshTokenData.save({validateBeforeSave: false})

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
  res.status(200).json({success: true, message: "successful"})
}



