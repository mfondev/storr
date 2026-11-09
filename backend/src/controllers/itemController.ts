import type { Request, Response } from "express";
import { prisma } from "../config/db.ts";

// List all items that belong to the logged-in user.
export const getItems = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id; // set by the auth middleware
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const items = await prisma.item.findMany({ where: { userId } });

  res.status(200).json({ status: "Success", data: { items } });
};

// Get a single item by id.
export const getItem = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const { id } = req.params; // which item — from the URL (/items/:id)
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid item id" });
    return;
  }

  const item = await prisma.item.findUnique({ where: { id } });

  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  if (item.userId !== userId) {
    res
      .status(403)
      .json({ message: "You are not authorized to view this item" });
    return;
  }

  res.status(200).json({ status: "Success", item });
};

// Create a new item for the logged-in user.
export const createItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id; // middleware already confirmed this user exists
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const {
    name,
    brand,
    category,
    priceCents,
    store,
    quantity,
    expiryDate,
    warrantyExpiresAt,
    serialNumber,
  } = req.body;

  const item = await prisma.item.create({
    data: {
      userId,
      name,
      brand,
      category,
      priceCents,
      store,
      quantity,
      expiryDate,
      warrantyExpiresAt,
      serialNumber,
    },
  });

  res.status(201).json({
    status: "Success",
    item,
    message: "item created successfully",
  });
};

export const updateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const { id } = req.params; // which item — from the URL (/items/:id)
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid item id" });
    return;
  }

  const {
    name,
    brand,
    category,
    priceCents,
    store,
    quantity,
    expiryDate,
    warrantyExpiresAt,
    serialNumber,
  } = req.body;

  const itemExist = await prisma.item.findUnique({ where: { id } });

  if (!itemExist) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  // ownership check — the item already knows its owner (itemExist.userId)
  if (itemExist.userId !== userId) {
    res
      .status(403)
      .json({ message: "You are not authorized to update this item" });
    return;
  }

  const item = await prisma.item.update({
    where: { id },
    data: {
      name,
      brand,
      category,
      priceCents,
      store,
      quantity,
      expiryDate,
      warrantyExpiresAt,
      serialNumber,
    },
  });

  res.status(200).json({
    status: "Success",
    item,
    message: "item updated successfully",
  });
};

// Delete an item by id.
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const { id } = req.params; // which item — from the URL (/items/:id)
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid item id" });
    return;
  }

  const itemExist = await prisma.item.findUnique({ where: { id } });

  if (!itemExist) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  if (itemExist.userId !== userId) {
    res
      .status(403)
      .json({ message: "You are not authorized to delete this item" });
    return;
  }

  await prisma.item.delete({ where: { id } });

  res
    .status(200)
    .json({ status: "Success", message: "item deleted successfully" });
};
