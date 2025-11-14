import { getErrorMessage } from "./error-message";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type Options<T> = {
  actionFn: () => Promise<T>;
};

const executeActions = async <T>({ actionFn }: Options<T>): Promise<T> => {
  try {
    return await actionFn();
  } catch (error) {
    const message = getErrorMessage(error);
    if (isRedirectError(error)) {
      console.error("Redirect Error:", error);
      throw error;
    }
    throw new Error(message);
  }
};

export { executeActions };
