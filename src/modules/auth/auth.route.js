import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validator.js";
import { authRateLimiter } from "../../shared/middleware/rateLimitter.middleware.js";

const router = Router();

// ----------------- Register -----------------
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  AuthController.register,
);

// ----------------- Login -----------------
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  AuthController.login,
);

// ----------------- Refresh Token -----------------
router.post(
  "/refresh-token",
  validate(refreshSchema),
  AuthController.refreshToken,
);

// ----------------- Logout -----------------
router.post("/logout", AuthController.logout);

export default router;
