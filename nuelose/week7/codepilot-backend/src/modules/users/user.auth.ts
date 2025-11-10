import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { LoginInput } from "./user.schema";
import bcrypt from "bcrypt";

export const loginUser = async (data: LoginInput) => {
  const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRE_IN || "1d";

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error("Incorrect Email or Password");

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) throw new Error("Incorrect Email or Password");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    message: "Login Successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};
