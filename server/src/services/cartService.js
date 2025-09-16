/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

class CartService {
    constructor() {
        this.cache = new Map(); // In-memory cache
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Get cart with caching
    async getCart(userId, useCache = true) {
        const cacheKey = `cart:${userId}`;

        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const cart = await Cart.findOne({ userId }).populate(
            "items.productId",
            "name price images mainImage stock status"
        );

        const result = cart ? this.formatCart(cart) : this.getEmptyCart();

        if (useCache) {
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now(),
            });
        }

        return result;
    }

    // Add item with validation
    async addItem(userId, productId, quantity = 1) {
        // Validate product
        const product = await Product.findById(productId);
        if (!product || product.status !== "active") {
            throw new Error("Sản phẩm không khả dụng");
        }

        if (product.stock < quantity) {
            throw new Error("Không đủ hàng trong kho");
        }

        // Get or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Update or add item
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].priceAtTime = product.price;
        } else {
            cart.items.push({
                productId,
                quantity,
                priceAtTime: product.price,
            });
        }

        cart.lastUpdated = new Date();
        await cart.save();

        // Clear cache
        this.cache.delete(`cart:${userId}`);

        return this.getCart(userId, false);
    }

    // Update item quantity
    async updateItem(userId, productId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(userId, productId);
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại");
        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        );
        if (!item) {
            throw new Error("Sản phẩm không có trong giỏ hàng");
        }

        // Check stock
        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            throw new Error("Không đủ hàng trong kho");
        }

        item.quantity = quantity;
        item.priceAtTime = product.price;
        cart.lastUpdated = new Date();
        await cart.save();

        this.cache.delete(`cart:${userId}`);
        return this.getCart(userId, false);
    }

    // Remove item
    async removeItem(userId, productId) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại");
        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );
        cart.lastUpdated = new Date();
        await cart.save();

        this.cache.delete(`cart:${userId}`);
        return this.getCart(userId, false);
    }

    // Clear cart
    async clearCart(userId) {
        await Cart.findOneAndUpdate(
            { userId },
            { items: [], lastUpdated: new Date() }
        );
        this.cache.delete(`cart:${userId}`);
        return this.getEmptyCart();
    }

    // Helper methods
    formatCart(cart) {
        // Manual calculation as fallback
        const manualTotalItems = cart.items.reduce(
            (total, item) => total + item.quantity,
            0
        );
        const manualTotalAmount = cart.items.reduce(
            (total, item) => total + item.priceAtTime * item.quantity,
            0
        );
        const manualIsEmpty = cart.items.length === 0;

        return {
            items: cart.items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.priceAtTime,
                product: {
                    id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    images: item.productId.images || [],
                    mainImage: item.productId.mainImage,
                    stock: item.productId.stock,
                    status: item.productId.status,
                },
            })),
            totalItems: cart.totalItems || manualTotalItems,
            totalAmount: cart.totalAmount || manualTotalAmount,
            isEmpty: cart.isEmpty !== undefined ? cart.isEmpty : manualIsEmpty,
            lastUpdated: cart.lastUpdated,
        };
    }

    getEmptyCart() {
        return {
            items: [],
            totalItems: 0,
            totalAmount: 0,
            isEmpty: true,
            lastUpdated: new Date(),
        };
    }

    // Clear cache for user
    clearUserCache(userId) {
        this.cache.delete(`cart:${userId}`);
    }

    // Clear all cache
    clearAllCache() {
        this.cache.clear();
    }
}

export const cartService = new CartService();
