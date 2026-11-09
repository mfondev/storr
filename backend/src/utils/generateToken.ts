import jwt from "jsonwebtoken";
import type { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not set. Add it to backend/.env.");
  }

  // 1. sign the jwt — this produces the token value
  const token = jwt.sign({ id: userId }, secret, { expiresIn: "2d" });

  // 2. store it in an httpOnly cookie the browser sends back automatically
  res.cookie("jwt", token, {
    httpOnly: true, // not readable by page JavaScript (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
    sameSite: "strict", // not sent on cross-site requests (CSRF protection)
    maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days, in milliseconds
  });

  return token;
};
