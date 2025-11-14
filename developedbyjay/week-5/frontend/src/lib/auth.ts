import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const getAccessTokenFromHeaders = async (): Promise<string> => {
  const headersList = await headers();
  const accessToken = headersList.get("x-access-token");

  if (!accessToken) {
    redirect("/login");
  }

  return accessToken;
};
