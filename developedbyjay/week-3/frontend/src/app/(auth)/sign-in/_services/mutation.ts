"use server";

import { apiClient } from "@/lib/request";
import { signInSchema, SignInFormData, UserData } from "../_types/schema";
import { executeActions } from "@/lib/execute-action";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();

  cookieStore.set("accessToken", action.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });
};

export { signIn };
