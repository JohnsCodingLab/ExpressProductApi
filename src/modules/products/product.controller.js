import { asyncHandler } from "../../shared/utils/ayncHandler.js";
import { ProductService } from "./product.service.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAll();

  res.status(200).json({
    status: "Success",
    data: products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getById(req.params.id);

  res.status(200).json({
    status: "Success",
    data: product,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.create(req.body, req.user.id);

  res.status(201).json({
    status: "Success",
    message: "Product created successfully",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.update(
    req.params.id,
    req.body,
    req.user,
  );

  res.status(200).json({
    status: "Success",
    message: "Product updated successfully",
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await ProductService.softDelete(req.params.id, req.user);

  res.status(200).json({
    status: "Success",
    message: "Product deleted successfully",
  });
});
