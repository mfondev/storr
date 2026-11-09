import { Router } from "express";

import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = Router();

// Every item route requires a logged-in user.
router.use(protect);

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
