import { CreateUserInput } from "./user.schema";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client";

export const createUserService = async (data: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) {
    throw new Error('Email already exist')
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return user;
};
