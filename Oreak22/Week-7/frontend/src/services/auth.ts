import { api } from "../lib/api";
import {
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
} from "../types/auth";

export const authService = {
  register: (payload: RegisterInput) =>
    api.post<AuthResponse>("/auth/register", payload),
  login: (payload: LoginInput) =>
    api.post<AuthResponse>("/auth/login", payload),
};
