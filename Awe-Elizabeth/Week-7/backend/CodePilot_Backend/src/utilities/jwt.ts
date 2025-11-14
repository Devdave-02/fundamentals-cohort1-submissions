import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "super" 
const JWT_EXPIRES_IN = "1h";

export const generateToken = (userDetails : object, expTime: string) => {

  //return jwt.sign({ userDetails }, JWT_SECRET, { expiresIn: expTime});
};