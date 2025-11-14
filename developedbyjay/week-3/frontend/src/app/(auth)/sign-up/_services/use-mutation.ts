
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignUpFormData } from "../_types/schema";
import { signUp } from "./mutation";

const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      await signUp(data);
    },
    onSuccess: () => {
      toast.success("Signed up successfully.");
      router.replace("/sign-in");
    },
  });
};

export { useSignUp };
