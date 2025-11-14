import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type SignUpFormData } from "../_types/schema";
import { signUp } from "./mutation";

const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      await signUp(data);
    },
    onSuccess: () => {
      toast.success("Signed up successfully.");
      navigate("/sign-in", { replace: true });
    },
  });
};

export { useSignUp };
