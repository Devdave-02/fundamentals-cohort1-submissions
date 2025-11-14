import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignInFormData } from "../_types/schema";
import { signIn } from "./mutation";


const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInFormData) => {
       await signIn(data);
    },
    onSuccess: () => {
      toast.success("Signed in successfully.");
      router.replace("/task-manager");
    },
  });
};

export { useSignIn };
