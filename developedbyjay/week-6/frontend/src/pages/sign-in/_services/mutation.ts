import { apiClient } from "@/lib/request";
import { signInSchema, type SignInFormData } from "../_types/schema";
import { executeActions } from "@/lib/execute-action";

const signIn = async (formData: SignInFormData) => {
  const action = await executeActions({
    actionFn: async () => {
      const validatedData = signInSchema.parse(formData);
      return await apiClient.post<{ accessToken: string }>("/auth/login", {
        email: validatedData.email,
        password: validatedData.password,
      });
    },
  });

  localStorage.setItem("accessToken", action.accessToken);
};

export { signIn };
