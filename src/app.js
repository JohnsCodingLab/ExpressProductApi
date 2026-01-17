import CookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { env } from "./config/env.js";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.route.js";
import productRouter from "./modules/products/product.route.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(CookieParser());
app.use(cors());
app.use(helmet());

if ((env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}

// Health check route to confirm API is running
app.get("/", (req, res) => {
  res.send("Express Product API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

// 404 handler
app.all("{/*path}", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler (MUST BE LAST)
app.use(errorHandler);

export default app;
