export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput = { email: string; password: string };

export type AuthResponse = {
  token: string;
  user?: { _id?: string; name?: string; email?: string };
};
