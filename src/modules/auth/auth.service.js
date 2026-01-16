import User from "../../models/User.js";
import { AppError } from "../../shared/utils/AppError.js";
import { logger } from "../../shared/utils/logger.js";
import { hashPassword } from "../../shared/utils/password.js";
import { TokenService } from "./token.service.js";

export class AuthService {
  // Register user
  static async register(data) {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      logger.warn(`User with email ${existing.email} already exists`);
      throw AppError.conflict("Email already in use");
    }

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await hashPassword(data.password),
      role: "buyer", // default role, adjust if needed
      isActive: true,
    });

    logger.info(`User registered successfully: ${user.email}`);

    const tokens = await this.issueTokens(user._id.toString(), user.role);
    logger.info(`Issued tokens for user ID: ${user._id}`);

    return {
      user: this.sanitize(user),
      tokens,
    };
  }

  // Login
  static async login(data, meta = {}) {
    const user = await User.findOne({ email: data.email });

    if (!user || !(await comparePassword(data.password, user.password))) {
      logger.warn(`Login failed for email ${data.email}`);
      throw AppError.unauthorized("Invalid credentials");
    }

    if (!user.isActive) {
      logger.warn(`Login failed: account disabled for UID ${user._id}`);
      throw AppError.forbidden("Account disabled");
    }

    user.lastLoginAt = new Date();
    await user.save();

    logger.debug(`Issuing token set for UID ${user._id}`);
    const tokens = await this.issueTokens(user._id.toString(), user.role, meta);

    return {
      user: this.sanitize(user),
      tokens,
    };
  }

  // Refresh access token
  static async refresh(refreshToken, meta = {}) {
    if (!refreshToken) {
      logger.warn("No refresh token provided");
      throw AppError.unauthorized("No refresh token provided");
    }

    const payload = await TokenService.verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.sub);

    if (!user) {
      logger.warn("User no longer exists");
      throw AppError.unauthorized("User no longer exists");
    }

    if (!user.isActive) {
      logger.warn("User account is disabled");
      throw AppError.forbidden("Account disabled");
    }

    await TokenService.revokeRefreshToken(payload.jti);

    const tokens = await this.issueTokens(user._id.toString(), user.role, meta);
    logger.info("Tokens issued successfully");

    return { tokens };
  }

  // Logout user
  static async logout(refreshToken) {
    if (!refreshToken) {
      logger.warn("No refresh token provided");
      throw AppError.unauthorized("No refresh token provided");
    }

    const payload = await TokenService.verifyRefreshToken(refreshToken);
    await TokenService.revokeAllUserTokens(payload.sub);
  }

  // Issue tokens to user
  static async issueTokens(userId, role, meta = {}) {
    const accessToken = TokenService.generateAccessToken(userId, role);
    const { token, jti } = TokenService.generateRefreshToken(userId);

    await TokenService.saveRefreshToken(token, userId, jti, meta);

    return { accessToken, refreshToken: token };
  }

  // Sanitize user object
  static sanitize(user) {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}
