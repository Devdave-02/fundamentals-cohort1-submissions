import { fromError } from "zod-validation-error";
import { ZodError } from "zod";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof ZodError) {
    const message = fromError(error);
    if (message) {
      return message.toString();
    }
  }

  
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

export { getErrorMessage };
