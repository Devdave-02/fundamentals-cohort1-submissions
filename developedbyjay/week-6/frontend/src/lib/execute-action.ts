import { ApiError } from "./request";
import { redirect } from "react-router-dom";

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

    throw new Error(String(error));
  }
};

export { executeActions };
