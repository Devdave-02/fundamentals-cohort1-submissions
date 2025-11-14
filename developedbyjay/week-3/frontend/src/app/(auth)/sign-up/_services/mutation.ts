"use server";

import { apiClient } from "@/lib/request";
import { signUpSchema, SignUpFormData } from "../_types/schema";
import { executeActions } from "@/lib/execute-action";

const signUp = async (formData: SignUpFormData) => {
  await executeActions({
    actionFn: async () => {
      const validatedData = signUpSchema.parse(formData);
      await apiClient.post<{ accessToken: string }>("/auth/register", {
        email: validatedData.email,
        name: validatedData.name,
        password: validatedData.password,
      });
    },
  });
};

export { signUp };
