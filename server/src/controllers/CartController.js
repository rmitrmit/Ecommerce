/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { cartService } from "../services/cartService.js";

export class CartController {
    // Get cart
    static async getCart(req, res) {
        try {
            const userId = req.user.userId;
            const cart = await cartService.getCart(userId);

            res.json({
                success: true,
                data: cart,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || "Lỗi server nội bộ",
            });
        }
    }

    // Add item
    static async addItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.userId;

            const cart = await cartService.addItem(userId, productId, quantity);

            res.json({
                success: true,
                data: cart,
                message: "Đã thêm sản phẩm vào giỏ hàng",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "Lỗi khi thêm sản phẩm vào giỏ hàng",
            });
        }
    }

    // Update item
    static async updateItem(req, res) {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            const userId = req.user.userId;

            const cart = await cartService.updateItem(
                userId,
                productId,
                quantity
            );

            res.json({
                success: true,
                data: cart,
                message: "Đã cập nhật giỏ hàng",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "Lỗi khi cập nhật giỏ hàng",
            });
        }
    }

    // Remove item
    static async removeItem(req, res) {
        try {
            const { productId } = req.params;
            const userId = req.user.userId;

            const cart = await cartService.removeItem(userId, productId);

            res.json({
                success: true,
                data: cart,
                message: "Đã xóa sản phẩm khỏi giỏ hàng",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
            });
        }
    }

    // Clear cart
    static async clearCart(req, res) {
        try {
            const userId = req.user.userId;
            const cart = await cartService.clearCart(userId);

            res.json({
                success: true,
                data: cart,
                message: "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || "Lỗi khi xóa giỏ hàng",
            });
        }
    }
}
