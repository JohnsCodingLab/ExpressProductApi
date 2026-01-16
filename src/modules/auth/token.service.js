import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import RefreshToken from "../../models/RefreshToken.js";
import { AppError } from "../../shared/utils/AppError.js";
import Session from "../../models/Session.js";
import { hashPassword } from "../../shared/utils/password.js";

export class TokenService {
  // Generate access token
  static generateAccessToken(userId, role) {
    return jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION,
    });
  }

  // Generate refresh token
  static generateRefreshToken(userId) {
    const jti = randomUUID();

    const token = jwt.sign({ sub: userId, jti }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRATION,
    });

    return { token, jti };
  }

  // Save refresh token to MongoDB
  static async saveRefreshToken(token, userId, jti, meta = {}) {
    const tokenHash = await hashPassword(token);

    const expireInMs =
      parseInt(env.JWT_REFRESH_EXPIRATION, 10) || 7 * 24 * 60 * 60 * 1000; // fallback 7 days
    const expiresAt = new Date(Date.now() + expireInMs);

    const refreshToken = new RefreshToken({
      jti,
      hashedToken: tokenHash,
      expiresAt,
      user: userId,
      ...meta,
    });

    await refreshToken.save();
  }

  // Verify access token
  static verifyAccessToken(token) {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string" || !decoded.sub || !decoded.role) {
      throw AppError.unauthorized("Invalid token payload");
    }

    return decoded;
  }

  // Verify refresh token
  static async verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);

      const stored = await RefreshToken.findOne({ jti: payload.jti });

      if (!stored || stored.isRevoked) {
        throw AppError.unauthorized("Refresh token revoked");
      }

      const valid = await bcrypt.compare(token, stored.hashedToken);
      if (!valid) {
        throw AppError.unauthorized("Invalid refresh token");
      }

      return { payload, stored };
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }
  }

  // Revoke a single refresh token
  static async revokeRefreshToken(jti, replacedByJti = null) {
    const token = await RefreshToken.findOne({ jti });
    if (token) {
      token.isRevoked = true;
      token.replacedByJti = replacedByJti;
      await token.save();
    }
  }

  // Revoke all refresh tokens for a user
  static async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany({ user: userId }, { isRevoked: true });
  }

  // Create a session for a login
  static async createSession(userId, meta = {}) {
    const session = new Session({
      user: userId,
      sessionId: randomUUID(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      lastUsedAt: new Date(),
    });

    await session.save();
    return session;
  }

  // Validate JWT payload
  static validatePayload(payload) {
    if (!payload?.sub || !payload?.role) {
      throw AppError.unauthorized("Invalid token payload structure");
    }

    const validRoles = ["buyer", "seller", "admin"];
    if (!validRoles.includes(payload.role)) {
      throw AppError.forbidden("Token contains an unrecognized user role");
    }

    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
