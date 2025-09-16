/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import express from "express";
import { auth } from "../middleware/auth.js";
import {
    validateCartItem,
    validateProductId,
    validateQuantity,
} from "../middleware/cartValidation.js";
import { CartController } from "../controllers/CartController.js";

const router = express.Router();

// Tất cả routes đều cần auth
router.use(auth);

// GET /api/cart - Lấy giỏ hàng
router.get("/", CartController.getCart);

// POST /api/cart/items - Thêm sản phẩm vào giỏ hàng
router.post("/items", validateCartItem, CartController.addItem);

// PUT /api/cart/items/:productId - Cập nhật số lượng sản phẩm
router.put(
    "/items/:productId",
    validateProductId,
    validateQuantity,
    CartController.updateItem
);

// DELETE /api/cart/items/:productId - Xóa sản phẩm khỏi giỏ hàng
router.delete(
    "/items/:productId",
    validateProductId,
    CartController.removeItem
);

// DELETE /api/cart - Xóa tất cả sản phẩm khỏi giỏ hàng
router.delete("/", CartController.clearCart);

export default router;
