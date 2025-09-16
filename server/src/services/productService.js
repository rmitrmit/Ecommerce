/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Product } from "../models/index.js";
import {
    PRODUCT_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    PAGINATION,
} from "../constants/index.js";

class ProductService {
    // Lấy tất cả sản phẩm với phân trang và lọc
    async getProducts(query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            category,
            minPrice,
            maxPrice,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
            status = PRODUCT_STATUS.ACTIVE,
        } = query;

        // Xây dựng object lọc
        const filter = { status };

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }

        // Xây dựng object sắp xếp
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Tính toán phân trang
        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const products = await Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .populate("vendor", "name email")
                .lean();

            const total = await Product.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    // Lấy sản phẩm theo ID
    async getProductById(productId) {
        try {
            const product = await Product.findById(productId)
                .populate("vendor", "name email")
                .lean();

            if (!product) {
                throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            return product;
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    // Tạo sản phẩm mới
    async createProduct(productData, vendorId) {
        try {
            const product = new Product({
                ...productData,
                vendor: vendorId,
            });

            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    // Cập nhật sản phẩm
    async updateProduct(productId, updateData, vendorId) {
        try {
            const product = await Product.findOneAndUpdate(
                { _id: productId, vendor: vendorId },
                updateData,
                { new: true, runValidators: true }
            );

            if (!product) {
                throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            return product;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    // Xóa sản phẩm
    async deleteProduct(productId, vendorId) {
        try {
            const product = await Product.findOneAndDelete({
                _id: productId,
                vendor: vendorId,
            });

            if (!product) {
                throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            return product;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    // Cập nhật tồn kho sản phẩm
    async updateStock(productId, quantity, operation = "decrease") {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            if (operation === "decrease") {
                if (product.stock < quantity) {
                    throw new Error(ERROR_MESSAGES.INSUFFICIENT_STOCK);
                }
                product.stock -= quantity;
            } else if (operation === "increase") {
                product.stock += quantity;
            }

            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }

    // Get products by vendor
    async getProductsByVendor(vendorId, query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
        } = query;

        const filter = { vendor: vendorId };
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const products = await Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean();

            const total = await Product.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new Error(`Error fetching vendor products: ${error.message}`);
        }
    }

    // Get product statistics
    async getProductStats(vendorId) {
        try {
            const stats = await Product.aggregate([
                { $match: { vendor: vendorId } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        totalValue: {
                            $sum: { $multiply: ["$price", "$stock"] },
                        },
                    },
                },
            ]);

            const totalProducts = await Product.countDocuments({
                vendor: vendorId,
            });
            const totalValue = stats.reduce(
                (sum, stat) => sum + stat.totalValue,
                0
            );

            return {
                totalProducts,
                totalValue,
                statusBreakdown: stats,
            };
        } catch (error) {
            throw new Error(`Error fetching product stats: ${error.message}`);
        }
    }
}

export default new ProductService();
