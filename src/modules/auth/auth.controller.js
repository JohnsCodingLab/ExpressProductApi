import { AppError } from "../../shared/utils/AppError.js";
import { asyncHandler } from "../../shared/utils/ayncHandler.js";
import { logger } from "../../shared/utils/logger.js";
import { AuthService } from "./auth.service.js";

// ----------------- Register -----------------
export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(result);
});

// ----------------- Login -----------------
export const login = asyncHandler(async (req, res) => {
  logger.info(`Login attempt initiated for: ${req.body.email}`);

  const result = await AuthService.login(req.body, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  logger.info(`Successful login for UID: ${result.user.email}`);

  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: false, // set to true in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    user: result.user,
    accessToken: result.tokens.accessToken,
  });
});

// ----------------- Refresh Token -----------------
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw AppError.unauthorized("No refresh token provided");
  }

  const result = await AuthService.refresh(refreshToken, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: false, // set to true in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    accessToken: result.tokens.accessToken,
  });
});

// ----------------- Logout -----------------
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await AuthService.logout(refreshToken);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // set to true in production
    sameSite: "lax",
  });

  res.status(204).send();
});
