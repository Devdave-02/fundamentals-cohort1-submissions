import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { type SignInFormData } from "../_types/schema";
import { signIn } from "./mutation";
import { useNavigate } from "react-router-dom";

const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      await signIn(data);
    },
    onSuccess: () => {
      toast.success("Signed in successfully.");
      navigate("/dashboard", { replace: true });
    },
  });
};

export { useSignIn };
