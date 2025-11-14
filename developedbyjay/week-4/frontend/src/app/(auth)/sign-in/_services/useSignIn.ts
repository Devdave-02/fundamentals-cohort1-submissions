import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignInFormData } from "../_types/schema";
import { signIn, signOut } from "./signInService";
import { toast } from "sonner";

const useSignIn = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      await signIn(data);
    },
    onSuccess: () => {
      toast.message("User signed-in successfully");
      router.push("/profile");
    },
  });
};

const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.push("/sign-in");
    },
  });
};

export { useSignIn, useSignOut };
