import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is require"),
  email: z.string().email("Email is required"),
  password: z.string().min(4, "Password must be atleast 5 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
