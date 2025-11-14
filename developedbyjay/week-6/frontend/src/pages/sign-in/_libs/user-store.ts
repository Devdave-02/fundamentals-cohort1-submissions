// import { createStore } from "@/lib/create-store";
// import { signInSchema, type SignInFormData } from "../_types/schema";
// import { executeActions } from "@/lib/execute-action";
// import { apiClient } from "@/lib/request";
// import { toast } from "sonner";

// type State = {
//   user: SignInFormData | null;
//   isLogginIn: boolean;
// };

// type Action = {
//   login: (formData: SignInFormData) => void;
// };

// type Store = State & Action;

// const useUserStore = createStore<Store>(
//   (set) => ({
//     user: null,
//     isLogginIn: false,

//     login: async (formData) => {
//       set({ isLogginIn: true });

//       const validatedData = signInSchema.parse(formData);
//       try {
//         const action = await apiClient.post<{
//           accessToken: string;
//           user: SignInFormData;
//         }>("/auth/login", {
//           email: validatedData.email,
//           password: validatedData.password,
//         });

//         set({ user: action.user });

//         localStorage.setItem("accessToken", action.accessToken);

//         toast.success("Login successful");
//       } catch (err: unknown) {
//         const message =
//           err &&
//           typeof err === "object" &&
//           "message" in err &&
//           typeof (err as any).message === "string"
//             ? (err as any).message
//             : "Login failed";
//         toast.error(message);
//         set({ user: null });
//       } finally {
//         set({ isLogginIn: false });
//       }
//     },
//   }),
//   {
//     skipPersist: true,
//   }
// );

// export { useUserStore };
