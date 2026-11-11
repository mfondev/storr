import { Router } from "express";

import { register, login, logout } from "../controllers/authController.ts";
import { validateRequest } from "../middleware/validateRequestMiddleware.ts";
import { registerSchema, loginSchema } from "../validators/authValidators.ts";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
