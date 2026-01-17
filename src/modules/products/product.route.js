import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";

import { checkRole } from "../../shared/middleware/rbac.middleware.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.validator.js";

const router = Router();

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected
router.post(
  "/",
  authenticate,
  checkRole(["seller", "admin", "buyer"]),
  validate(createProductSchema),
  createProduct,
);

router.put(
  "/:id",
  authenticate,
  checkRole(["seller", "admin"]),
  validate(updateProductSchema),
  updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  checkRole(["seller", "admin"]),
  deleteProduct,
);

export default router;
