import { use_prisma } from "@src/lib/prisma-client";
import { comparePassword, hashPassword } from "@src/utils";
import { z } from "zod";

export const userParamSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z
      .string()
      .email("Invalid email format")
      .max(100, "Email must be at most 100 characters")
      .refine(
        async (email) => {
          const user = await use_prisma.user.findUnique({ where: { email } });
          if (user) {
            return false;
          }
          return true;
        },
        {
          message: "Email already exists",
        }
      ),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
    role: z.enum(["user", "admin"]).default("user"),
  }),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .email("Invalid Email Format")
        .max(100, "Email must be at most 100 characters"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100),
    })
    .refine(
      async ({ email, password }) => {
        const user = await use_prisma.user.findUnique({ where: { email } });
        if (!user) return false;
        const isMatch = await comparePassword(password, user.password);
        return isMatch;
      },
      {
        message: "Invalid email or password",
      }
    ),
});

export type signUpInput = Pick<
  z.infer<typeof createUserSchema>["body"],
  "name" | "email" | "password" | "role"
>;
export type loginInput = Pick<
  z.infer<typeof loginSchema>["body"],
  "email" | "password"
>;

export type userParamInput = z.infer<typeof userParamSchema>["params"];
