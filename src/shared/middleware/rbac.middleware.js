import { AppError } from "../utils/AppError.js";

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(AppError.unauthorized("Authentication required"));
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      return next(
        AppError.forbidden("You do not have permission to perform this action"),
      );
    }

    next();
  };
};
