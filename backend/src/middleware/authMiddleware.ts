import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../config/db.ts";

// Shape of the payload we signed in generateToken.
interface TokenPayload {
  id: string;
}

// Gate for protected routes: verify the JWT cookie, then attach req.user.
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Mobile clients send the token in the Authorization header; the web app may
  // send it as an httpOnly cookie. Accept either.
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;
  const cookieToken =
    typeof req.cookies?.jwt === "string" ? req.cookies.jwt : undefined;
  const token = headerToken ?? cookieToken;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    res.status(500).json({ message: "JWT secret not configured" });
    return;
  }

  try {
    // jwt.verify returns string | JwtPayload; we signed { id }, so assert that shape here.
    const { id } = jwt.verify(token, secret) as TokenPayload;

    // Confirm the user still exists (could have been deleted after the token was issued).
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(401).json({ message: "User no longer exists" });
      return;
    }

    req.user = { id: user.id };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
