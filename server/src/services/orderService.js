/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Order, Product, Shipper } from "../models/index.js";
import {
    ORDER_STATUS,
    ERROR_MESSAGES,
    PAGINATION,
} from "../constants/index.js";

class OrderService {
    // Tạo đơn hàng mới
    async createOrder(orderData, customerId) {
        try {
            // Xác thực sản phẩm và tính tổng
            let totalAmount = 0;
            const validatedProducts = [];

            for (const item of orderData.products) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(
                        `Insufficient stock for product ${product.name}`
                    );
                }

                if (product.status !== "active") {
                    throw new Error(`Product ${product.name} is not available`);
                }

                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;

                validatedProducts.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price,
                });
            }

            // Tạo đơn hàng
            const order = new Order({
                customerId,
                products: validatedProducts,
                totalAmount,
                customerAddress: orderData.customerAddress,
                assignedHub: orderData.assignedHub,
                status: ORDER_STATUS.PENDING,
            });

            await order.save();

            // Cập nhật tồn kho sản phẩm
            for (const item of validatedProducts) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }

            return order;
        } catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    // Lấy đơn hàng theo ID
    async getOrderById(orderId) {
        try {
            const order = await Order.findById(orderId)
                .populate("customerId", "name email phone")
                .populate("products.productId", "name price images")
                .populate("assignedHub", "name address")
                .lean();

            if (!order) {
                throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            return order;
        } catch (error) {
            throw new Error(`Error fetching order: ${error.message}`);
        }
    }

    // Lấy đơn hàng theo customer
    async getOrdersByCustomer(customerId, query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        const filter = { customerId };
        if (status) filter.status = status;

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const orders = await Order.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .populate("products.productId", "name price images")
                .populate("assignedHub", "name address")
                .lean();

            const total = await Order.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                orders,
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
            throw new Error(`Error fetching customer orders: ${error.message}`);
        }
    }

    // Lấy đơn hàng theo hub
    async getOrdersByHub(hubId, query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
        } = query;

        const filter = { assignedHub: hubId };
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const orders = await Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate("customerId", "name email phone")
                .populate("products.productId", "name price images")
                .lean();

            const total = await Order.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                orders,
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
            throw new Error(`Error fetching hub orders: ${error.message}`);
        }
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId, newStatus, updatedBy) {
        try {
            const validStatuses = Object.values(ORDER_STATUS);
            if (!validStatuses.includes(newStatus)) {
                throw new Error(`Invalid status: ${newStatus}`);
            }

            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            // Kiểm tra chuyển đổi trạng thái có hợp lệ không
            const currentStatus = order.status;
            if (!this.isValidStatusTransition(currentStatus, newStatus)) {
                throw new Error(
                    `Cannot change status from ${currentStatus} to ${newStatus}`
                );
            }

            order.status = newStatus;
            order.updatedAt = new Date();

            // Nếu đơn hàng bị hủy, khôi phục tồn kho sản phẩm
            if (newStatus === ORDER_STATUS.CANCELLED) {
                for (const item of order.products) {
                    await Product.findByIdAndUpdate(item.productId, {
                        $inc: { stock: item.quantity },
                    });
                }
            }

            await order.save();
            return order;
        } catch (error) {
            throw new Error(`Error updating order status: ${error.message}`);
        }
    }

    // Gán đơn hàng cho shipper
    async assignOrderToShipper(orderId, shipperId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            // Xác thực shipper tồn tại và được gán vào cùng hub
            const shipper = await Shipper.findById(shipperId);
            if (!shipper) {
                throw new Error("Invalid shipper");
            }

            if (
                shipper.assignedHub.toString() !== order.assignedHub.toString()
            ) {
                throw new Error("Shipper is not assigned to this hub");
            }

            order.status = ORDER_STATUS.CONFIRMED;
            order.updatedAt = new Date();
            // Bạn có thể muốn thêm trường shipper để theo dõi ai đang xử lý đơn hàng

            await order.save();
            return order;
        } catch (error) {
            throw new Error(
                `Error assigning order to shipper: ${error.message}`
            );
        }
    }

    // Lấy tất cả đơn hàng với phân trang và lọc
    async getOrders(query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            hubId,
            customerId,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        const filter = {};
        if (status) filter.status = status;
        if (hubId) filter.assignedHub = hubId;
        if (customerId) filter.customerId = customerId;

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const orders = await Order.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .populate("customerId", "name email phone")
                .populate("products.productId", "name price images")
                .populate("assignedHub", "name address")
                .lean();

            const total = await Order.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                orders,
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
            throw new Error(`Error fetching orders: ${error.message}`);
        }
    }

    // Lấy thống kê đơn hàng
    async getOrderStats(hubId = null) {
        try {
            const matchStage = hubId ? { assignedHub: hubId } : {};

            const stats = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        totalAmount: { $sum: "$totalAmount" },
                    },
                },
            ]);

            const totalOrders = await Order.countDocuments(matchStage);
            const totalRevenue = stats.reduce(
                (sum, stat) => sum + stat.totalAmount,
                0
            );

            return {
                totalOrders,
                totalRevenue,
                statusBreakdown: stats,
            };
        } catch (error) {
            throw new Error(`Error fetching order stats: ${error.message}`);
        }
    }

    // Hủy đơn hàng
    async cancelOrder(orderId, customerId) {
        try {
            const order = await Order.findOne({
                _id: orderId,
                customerId: customerId,
            });

            if (!order) {
                throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            if (order.status === ORDER_STATUS.CANCELLED) {
                throw new Error("Order is already cancelled");
            }

            if (order.status === ORDER_STATUS.DELIVERED) {
                throw new Error("Cannot cancel delivered order");
            }

            // Khôi phục tồn kho sản phẩm
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity },
                });
            }

            order.status = ORDER_STATUS.CANCELLED;
            order.updatedAt = new Date();
            await order.save();

            return order;
        } catch (error) {
            throw new Error(`Error cancelling order: ${error.message}`);
        }
    }

    // Phương thức helper để xác thực chuyển đổi trạng thái
    isValidStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [ORDER_STATUS.PENDING]: [
                ORDER_STATUS.CONFIRMED,
                ORDER_STATUS.CANCELLED,
            ],
            [ORDER_STATUS.CONFIRMED]: [
                ORDER_STATUS.PROCESSING,
                ORDER_STATUS.CANCELLED,
            ],
            [ORDER_STATUS.PROCESSING]: [
                ORDER_STATUS.SHIPPED,
                ORDER_STATUS.CANCELLED,
            ],
            [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
            [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURNED],
            [ORDER_STATUS.CANCELLED]: [],
            [ORDER_STATUS.RETURNED]: [],
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
}

export default new OrderService();
