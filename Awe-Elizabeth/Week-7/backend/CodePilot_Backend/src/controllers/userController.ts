import mongoose from "mongoose"
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { userInfo } from "os";
import asyncHandler from "../utilities/asyncHandler";


export const getUser = asyncHandler(async (req: Request, res: Response) => {
    if(!req.params.id)
        return res.status(400).json({success: false, message: "userId is required"})
    const user = await User.findById(req)
    if(!user)
        return res.status(400).json({success: false, message: "user does not exist"})

    return res.status(200).json({success: true, message: "success", result: user})
})

export const getLoggedInUser = asyncHandler(async (req: Request, res: Response) => {
    if(!req.user?._id)
        return res.status(400).json({success: false, message: "userId is required"})
    const user = await User.findById(req.user._id)
    if(!user)
        return res.status(400).json({success: false, message: "user does not exist"})

    return res.status(200).json({success: true, message: "success", result: user})
})

export const updateUserProfile = (req: Request, res: Response) => {
    
}