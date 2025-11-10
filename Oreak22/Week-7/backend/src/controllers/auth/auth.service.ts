import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const registerUser = async (email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");
  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed });
  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user, token };
};
