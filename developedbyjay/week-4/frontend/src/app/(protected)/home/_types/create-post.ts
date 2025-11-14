import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Minimum Length must be greater than two" })
    .max(5000),
});

export type PostFormData = z.infer<typeof postSchema>;

export const postDefaultValues: PostFormData = {
  content: "",
};
