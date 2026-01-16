export class AppError extends Error {
  constructor(message, statusCode = 500, code) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, code) {
    return new AppError(message, 400, code);
  }

  static unauthorized(message = "Unauthorized", code) {
    return new AppError(message, 401, code);
  }

  static forbidden(message = "Forbidden", code) {
    return new AppError(message, 403, code);
  }

  static notFound(message = "Resource not found", code) {
    return new AppError(message, 404, code);
  }

  static conflict(message, code) {
    return new AppError(message, 409, code);
  }

  static validation(message, code) {
    return new AppError(message, 422, code);
  }

  static internal(message = "Internal server error", code) {
    return new AppError(message, 500, code);
  }
}
