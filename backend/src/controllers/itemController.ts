import type { Request, Response } from "express";

// Placeholder handlers (no DB yet) so the routes are visible end-to-end.
export const getItems = (_req: Request, res: Response): void => {
  res.json({ items: [] });
};

export const getItem = (req: Request, res: Response): void => {
  res.json({ id: req.params.id });
};

export const createItem = (req: Request, res: Response): void => {
  res.status(201).json({ message: "item created", received: req.body });
};

export const updateItem = (req: Request, res: Response): void => {
  res.json({ message: "item updated", id: req.params.id, received: req.body });
};

export const deleteItem = (req: Request, res: Response): void => {
  res.status(204).send();
};
