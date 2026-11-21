import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  logout,
  getMe,
} from "../controllers/authController.ts";
import { protect } from "../middleware/authMiddleware.ts";
import { validateRequest } from "../middleware/validateRequestMiddleware.ts";
import {
  registerSchema,
  loginSchema,
  googleSchema,
} from "../validators/authValidators.ts";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/google", validateRequest(googleSchema), googleAuth);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
