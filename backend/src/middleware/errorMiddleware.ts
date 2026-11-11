import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client.ts";

// Final middleware: turns any thrown/forwarded error into clean JSON.
// Express recognises it as an error handler because it takes 4 arguments.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Map known Prisma errors to friendly status codes.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res
        .status(409)
        .json({ status: "error", message: "A record with that value already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ status: "error", message: "Record not found" });
      return;
    }
  }

  // Log the real error server-side; never leak internals to the client.
  console.error("Unhandled error:", err);

  res.status(500).json({ status: "error", message: "Internal server error" });
};
