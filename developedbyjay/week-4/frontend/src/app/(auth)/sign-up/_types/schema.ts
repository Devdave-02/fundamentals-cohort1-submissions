import { z } from "zod";

const signUpSchema = z
  .object({
    username: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(9).max(100),
    confirmPassword: z.string().min(9).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const signUpDefaultValues: SignUpFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export { type SignUpFormData, signUpSchema, signUpDefaultValues };
