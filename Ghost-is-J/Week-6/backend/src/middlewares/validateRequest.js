import {ZodError} from "zod";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
        console.log("Caught error in validateRequest:", error);
      if (error instanceof ZodError && Array.isArray(error.errors)) {
        // Zod validation error
        return res.status(400).json({
          status: "fail",
          errors: error.errors.map((err) => err.message),
        });
      }

      // Any other error
      console.error("Unexpected error in validation middleware:", error);
      return res.status(500).json({
        status: "error",
        message: "An unexpected error occurred during validation",
      });
    }
  };
};
