import type { Request, Response } from "express";

// Placeholder handlers (no DB yet) so the routes are visible end-to-end.
export const register = (req: Request, res: Response): void => {
  res.status(201).json({ message: "user registered", received: req.body });
};

export const login = (req: Request, res: Response): void => {
  res.json({ message: "user logged in", received: req.body });
};

export const logout = (_req: Request, res: Response): void => {
  res.json({ message: "user logged out" });
};
