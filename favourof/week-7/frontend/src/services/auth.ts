import { apiPost } from "./api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiPost("/auth/register", data);
}

export async function loginUser(data: { email: string; password: string }) {
  return apiPost("/auth/login", data);
}
