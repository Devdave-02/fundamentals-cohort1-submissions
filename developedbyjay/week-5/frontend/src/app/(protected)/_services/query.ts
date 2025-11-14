"use server";

import { executeActions } from "@/lib/execute-action";
import { apiClient } from "@/lib/request";

import { AuthResponse } from "../_types/user-schema";
import { getAccessTokenFromHeaders } from "@/lib/auth";

export const getUser = async () => {
  const accessToken = await getAccessTokenFromHeaders();
  return await executeActions({
    actionFn: () => {
      return apiClient.get<AuthResponse>("/user/current", accessToken);
    },
  });
};
