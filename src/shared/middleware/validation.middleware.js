import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          path: issue.path[issue.path.length - 1],
          message: issue.message,
        }));

        return next(AppError.validation("Validation Failed", details));
      }
      next(error);
    }
  };
};
