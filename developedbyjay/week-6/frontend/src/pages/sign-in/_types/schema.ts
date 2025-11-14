import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

type SignInFormData = z.infer<typeof signInSchema>;

const signInDefaultValues: SignInFormData = {
  password: "Developedbyjay@1",
  email: "developeddotjay@gmail.com",
};



export {

  type SignInFormData,
  signInSchema,
  signInDefaultValues,
};
