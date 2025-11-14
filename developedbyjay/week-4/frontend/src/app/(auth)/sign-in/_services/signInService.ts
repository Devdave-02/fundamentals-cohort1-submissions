"use server";

import { signIn as nextAuthSignIn, signOut as authSignOut } from "@/lib/auth";
import { executeActions } from "@/lib/execute-action";
import { signInSchema, SignInFormData } from "../_types/schema";
import { redirect } from "next/navigation";

const signIn = async (data: SignInFormData) => {
  await executeActions({
    actionFn: async () => {
      const validatedData = signInSchema.parse(data);
      await nextAuthSignIn("credentials", validatedData);
    },
  });
};

const signOut = () => {
  return executeActions({
    actionFn: authSignOut,
  });
};

export { signIn, signOut };
