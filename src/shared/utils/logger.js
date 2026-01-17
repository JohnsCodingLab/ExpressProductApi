import { isDevelopment } from "../../config/env.js";

class Logger {
  log(level, message, meta) {
    const timestamp = new Date().toISOString();

    if (isDevelopment) {
      // Map levels to console methods
      const consoleMethod =
        level === "debug"
          ? "debug"
          : level === "error"
            ? "error"
            : level === "warn"
              ? "warn"
              : "log";

      console[consoleMethod](
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        meta !== undefined ? meta : "",
      );
    } else {
      // Production JSON logging
      console.log(JSON.stringify({ timestamp, level, message, meta }));
    }
  }

  info(message, meta) {
    this.log("info", message, meta);
  }

  warn(message, meta) {
    this.log("warn", message, meta);
  }

  error(message, meta) {
    this.log("error", message, meta);
  }

  debug(message, meta) {
    if (isDevelopment) {
      this.log("debug", message, meta);
    }
  }
}

export const logger = new Logger();
