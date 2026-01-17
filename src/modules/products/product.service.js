import Product from "../../models/Product.js";
import { AppError } from "../../shared/utils/AppError.js";

export class ProductService {
  static async getAll() {
    return Product.find({
      isDeleted: false,
      isActive: true,
    }).sort({ createdAt: -1 });
  }

  static async getById(productId) {
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).populate("seller", "firstName lastName email");

    if (!product) {
      throw AppError.notFound("Product not found");
    }

    return product;
  }

  static async create(data, sellerId) {
    return Product.create({
      ...data,
      seller: sellerId,
    });
  }

  static async update(productId, data, user) {
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) throw AppError.notFound("Product not found");

    if (product.seller.toString() !== user.id && user.role !== "admin") {
      throw AppError.forbidden("You cannot update this product");
    }

    Object.assign(product, data);
    return product.save();
  }

  static async softDelete(productId, user) {
    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      throw AppError.notFound("Product not found");
    }

    if (product.seller.toString() !== user.id && user.role !== "admin") {
      throw AppError.forbidden("You cannot delete this product");
    }

    product.isDeleted = true;
    product.isActive = false;

    return product.save();
  }
}
