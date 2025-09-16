/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { DistributionHub } from "../models/index.js";

// Lấy tất cả distribution hubs
export const getHubs = async (req, res) => {
    try {
        const hubs = await DistributionHub.find().sort({ name: 1 });

        res.json({
            hubs,
            total: hubs.length,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Tạo hub mới (cho admin)
export const createHub = async (req, res) => {
    try {
        const { name, address } = req.body;

        // Kiểm tra tên hub đã tồn tại chưa
        const existingHub = await DistributionHub.findOne({ name });
        if (existingHub) {
            return res.status(400).json({
                error: "Tên hub đã tồn tại",
            });
        }

        // Tạo hub mới
        const hub = new DistributionHub({
            name,
            address,
        });

        await hub.save();

        res.status(201).json({
            message: "Tạo hub thành công",
            hub: {
                id: hub._id,
                name: hub.name,
                address: hub.address,
                createdAt: hub.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Cập nhật hub
export const updateHub = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;

        // Tìm hub
        const hub = await DistributionHub.findById(id);
        if (!hub) {
            return res.status(404).json({
                error: "Không tìm thấy hub",
            });
        }

        // Kiểm tra tên hub đã tồn tại chưa (nếu thay đổi)
        if (name && name !== hub.name) {
            const existingHub = await DistributionHub.findOne({ name });
            if (existingHub) {
                return res.status(400).json({
                    error: "Tên hub đã tồn tại",
                });
            }
        }

        // Cập nhật hub
        hub.name = name || hub.name;
        hub.address = address || hub.address;
        await hub.save();

        res.json({
            message: "Cập nhật hub thành công",
            hub: {
                id: hub._id,
                name: hub.name,
                address: hub.address,
                updatedAt: hub.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Xóa hub
export const deleteHub = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm hub
        const hub = await DistributionHub.findById(id);
        if (!hub) {
            return res.status(404).json({
                error: "Không tìm thấy hub",
            });
        }

        // Kiểm tra có shipper nào được gán cho hub này không
        const shippers = await BaseUser.find({ assignedHub: id });
        if (shippers.length > 0) {
            return res.status(400).json({
                error: "Không thể xóa hub vì còn shipper được gán",
            });
        }

        // Kiểm tra có đơn hàng nào được gán cho hub này không
        const orders = await Order.find({ assignedHub: id });
        if (orders.length > 0) {
            return res.status(400).json({
                error: "Không thể xóa hub vì còn đơn hàng được gán",
            });
        }

        await DistributionHub.findByIdAndDelete(id);

        res.json({
            message: "Xóa hub thành công",
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};
