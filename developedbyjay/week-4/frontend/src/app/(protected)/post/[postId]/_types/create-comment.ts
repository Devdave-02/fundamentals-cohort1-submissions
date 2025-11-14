import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Minimum Length must be greater than two" })
    .max(5000),
  id: z.string(),
});

export type CommentFormData = z.infer<typeof commentSchema>;

export const commentDefaultValue: CommentFormData = {
  content: "",
  id: "",
};
