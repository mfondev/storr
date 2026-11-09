import "express";

// Add `req.user`, set by the auth middleware after verifying the JWT.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}
