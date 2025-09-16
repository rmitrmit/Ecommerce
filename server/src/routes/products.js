/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import express from "express";
import { upload } from "../middleware/upload.js";
import { auth, requireVendor } from "../middleware/auth.js";
import {
    productValidation,
    checkValidationErrors,
} from "../middleware/validation.js";
import {
    getProducts,
    getProductById,
    getVendorProducts,
    getProductCategories,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/ProductController.js";

const router = express.Router();

// Lấy tất cả sản phẩm (public)
router.get("/", getProducts);

// Lấy danh mục sản phẩm (public)
router.get("/categories", getProductCategories);

// Lấy chi tiết sản phẩm (public)
router.get("/:id", getProductById);

// Lấy sản phẩm của vendor (cần auth)
router.get("/vendor/products", auth, requireVendor, getVendorProducts);

// Thêm sản phẩm mới (cần auth + vendor role)
router.post(
    "/vendor/products",
    auth,
    requireVendor,
    upload.single("image"),
    productValidation,
    checkValidationErrors,
    addProduct
);

// Cập nhật sản phẩm (cần auth + vendor role)
router.put(
    "/vendor/products/:id",
    auth,
    requireVendor,
    upload.single("image"),
    productValidation,
    checkValidationErrors,
    updateProduct
);

// Xóa sản phẩm (cần auth + vendor role)
router.delete("/vendor/products/:id", auth, requireVendor, deleteProduct);

export default router;
