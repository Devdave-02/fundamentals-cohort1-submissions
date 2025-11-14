import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ApiError } from "./request";
import { redirect } from "next/navigation";

type Options<T> = {
  actionFn: () => Promise<T>;
};

const executeActions = async <T>({ actionFn }: Options<T>): Promise<T> => {
  try {
    return await actionFn();
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      // We can perform a refresh token functionality here
      redirect("/sign-in");
    }

    if (isRedirectError(error)) {
      console.error("Redirect Error:", error);
      throw error;
    }
    throw new Error(String(error));
  }
};

export { executeActions };
