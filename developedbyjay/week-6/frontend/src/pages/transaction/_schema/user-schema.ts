import type { PaginatedResponse } from "@/lib/types";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string; // ISO timestamp
}

export type UsersResponse = PaginatedResponse<UserSummary>;
