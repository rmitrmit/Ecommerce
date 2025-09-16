/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Order, Product, DistributionHub, BaseUser } from "../models/index.js";
import { cartService } from "../services/index.js";

export const createOrder = async (req, res) => {
    try {
        const { customerAddress } = req.body;
        const customerId = req.user.userId;

        const cart = await cartService.getCart(customerId);

        if (cart.isEmpty) {
            return res.status(400).json({
                error: "Giỏ hàng trống, không thể tạo đơn hàng",
            });
        }

        for (const item of cart.items) {
            if (item.productId.stock < item.quantity) {
                return res.status(400).json({
                    error: `Sản phẩm ${item.productId.name} không đủ tồn kho`,
                });
            }
        }

        const totalAmount = cart.totalAmount;

        const hubs = await DistributionHub.find();
        if (hubs.length === 0) {
            return res.status(500).json({
                error: "Không có hub phân phối nào",
            });
        }

        const randomHub = hubs[Math.floor(Math.random() * hubs.length)];

        const orderProducts = cart.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.price,
        }));
        const order = new Order({
            customerId,
            products: orderProducts,
            totalAmount,
            customerAddress,
            assignedHub: randomHub._id,
        });

        await order.save();

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity },
            });
        }

        await cartService.clearCart(customerId);

        res.status(201).json({
            message: "Tạo đơn hàng thành công",
            order: {
                id: order._id,
                customerId: order.customerId,
                products: order.products,
                totalAmount: order.totalAmount,
                customerAddress: order.customerAddress,
                assignedHub: order.assignedHub,
                status: order.status,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Lỗi server nội bộ",
        });
    }
};

export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.user.userId;

        const orders = await Order.find({ customerId })
            .populate("products.productId", "name price images mainImage")
            .populate("assignedHub", "name address")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders.map((order) => ({
                id: order._id,
                products: order.products,
                totalAmount: order.totalAmount,
                customerAddress: order.customerAddress,
                assignedHub: order.assignedHub,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            })),
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Lỗi server nội bộ",
        });
    }
};

export const getShipperOrders = async (req, res) => {
    try {
        const shipperId = req.user.userId;

        const shipper = await BaseUser.findById(shipperId);
        if (!shipper || shipper.role !== "Shipper") {
            return res.status(403).json({
                error: "Chỉ shipper mới có thể xem đơn hàng",
            });
        }

        const orders = await Order.find({
            assignedHub: shipper.assignedHub,
            status: "active",
        })
            .populate("customerId", "username name address")
            .populate("assignedHub", "name address")
            .populate("products.productId", "name price images")
            .sort({ createdAt: -1 });

        res.json({
            orders,
            total: orders.length,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const shipperId = req.user.userId;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                error: "Không tìm thấy đơn hàng",
            });
        }

        const shipper = await BaseUser.findById(shipperId);
        if (!shipper || shipper.role !== "Shipper") {
            return res.status(403).json({
                error: "Chỉ shipper mới có thể cập nhật trạng thái đơn hàng",
            });
        }

        if (shipper.assignedHub.toString() !== order.assignedHub.toString()) {
            return res.status(403).json({
                error: "Shipper không được gán cho hub này",
            });
        }

        order.status = status;
        order.updatedAt = new Date();
        await order.save();

        res.json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            order: {
                id: order._id,
                status: order.status,
                updatedAt: order.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate("customerId", "username name address")
            .populate("assignedHub", "name address")
            .populate("products.productId", "name price images")
            .sort({ createdAt: -1 });

        res.json({
            orders,
            total: orders.length,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};
