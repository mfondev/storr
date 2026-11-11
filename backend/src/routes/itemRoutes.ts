import { Router } from "express";

import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.ts";
import { protect } from "../middleware/authMiddleware.ts";
import { validateRequest } from "../middleware/validateRequestMiddleware.ts";
import {
  createItemSchema,
  updateItemSchema,
} from "../validators/itemValidators.ts";

const router = Router();

// Every item route requires a logged-in user.
router.use(protect);

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", validateRequest(createItemSchema), createItem);
router.put("/:id", validateRequest(updateItemSchema), updateItem);
router.delete("/:id", deleteItem);

export default router;
