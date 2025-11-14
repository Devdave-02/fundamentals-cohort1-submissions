import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

type SignInFormData = z.infer<typeof signInSchema>;

const signInDefaultValues: SignInFormData = {
  password: "Developedbyjay@1",
  email: "joshua@gmail.com",
};

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

const userDefaultValue: UserData = {
  _id: "",
  name: "",
  email: "",
  role: "",
};

export {
  type SignInFormData,
  type UserData,
  userDefaultValue,
  signInSchema,
  signInDefaultValues,
};
