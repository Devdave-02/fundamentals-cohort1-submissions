"use server";

import { executeActions } from "@/lib/execute-action";
import { SignUpFormData, signUpSchema } from "../_types/schema";
import { apiClient } from "@/lib/request";

const signUp = async (data: SignUpFormData) => {
  await executeActions({
    actionFn: async () => {
      const validatedData = signUpSchema.parse(data);

      await apiClient.post("/auth/register", {
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        role: "user",
      });
    },
  });
};

export { signUp };
