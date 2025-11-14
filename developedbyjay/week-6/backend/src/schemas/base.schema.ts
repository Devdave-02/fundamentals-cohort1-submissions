import z from "zod";

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().default("1"),
    limit: z.string().default("10"),
  }),
});
