import { TokenService } from "../../modules/auth/token.service.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/ayncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AppError.unauthorized("Authentication Required", "NO_TOKEN");
  }

  const token = authHeader.split(" ")[1];

  // Verify and decode access token
  const payload = TokenService.verifyAccessToken(token);

  // Validate payload and attach user info to request
  req.user = TokenService.validatePayload(payload);

  next();
});
