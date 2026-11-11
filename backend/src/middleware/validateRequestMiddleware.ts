import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

// Factory: give it a zod schema, get a middleware that validates req.body.
// On success it replaces req.body with the parsed data; on failure it sends 400.
export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
      return;
    }

    // hand the cleaned, typed data to the controller
    req.body = result.data;
    next();
  };
