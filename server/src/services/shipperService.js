/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Shipper } from "../models/index.js";
import { DistributionHub } from "../models/index.js";
import authService from "./authService.js";
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    PAGINATION,
    USER_ROLES,
} from "../constants/index.js";

class ShipperService {
    // Tạo shipper mới
    async createShipper(shipperData) {
        try {
            // Xác thực độ mạnh mật khẩu
            authService.validatePassword(shipperData.password);

            // Mã hóa mật khẩu
            const hashedPassword = await authService.hashPassword(
                shipperData.password
            );

            // Tạo shipper
            const shipper = new Shipper({
                ...shipperData,
                password: hashedPassword,
                role: USER_ROLES.SHIPPER,
            });

            await shipper.save();
            return shipper;
        } catch (error) {
            throw new Error(`Error creating shipper: ${error.message}`);
        }
    }

    // Lấy shipper theo ID
    async getShipperById(shipperId) {
        try {
            const shipper = await Shipper.findById(shipperId).lean();
            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return shipper;
        } catch (error) {
            throw new Error(`Error fetching shipper: ${error.message}`);
        }
    }

    // Lấy shipper theo email
    async getShipperByEmail(email) {
        try {
            const shipper = await Shipper.findOne({ email }).lean();
            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return shipper;
        } catch (error) {
            throw new Error(`Error fetching shipper: ${error.message}`);
        }
    }

    // Cập nhật shipper
    async updateShipper(shipperId, updateData) {
        try {
            // Nếu cập nhật mật khẩu, mã hóa nó
            if (updateData.password) {
                authService.validatePassword(updateData.password);
                updateData.password = await authService.hashPassword(
                    updateData.password
                );
            }

            const shipper = await Shipper.findByIdAndUpdate(
                shipperId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return shipper;
        } catch (error) {
            throw new Error(`Error updating shipper: ${error.message}`);
        }
    }

    // Gán shipper vào hub
    async assignToHub(shipperId, hubId) {
        try {
            // Xác thực hub tồn tại
            const hub = await DistributionHub.findById(hubId);
            if (!hub) {
                throw new Error("Distribution hub not found");
            }

            // Cập nhật shipper
            const shipper = await Shipper.findByIdAndUpdate(
                shipperId,
                { assignedHub: hubId },
                { new: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return shipper;
        } catch (error) {
            throw new Error(`Error assigning shipper to hub: ${error.message}`);
        }
    }

    // Cập nhật vị trí shipper
    async updateLocation(shipperId, location) {
        try {
            const shipper = await Shipper.findByIdAndUpdate(
                shipperId,
                {
                    "workStatus.currentLocation": {
                        ...location,
                        updatedAt: new Date(),
                    },
                },
                { new: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return shipper;
        } catch (error) {
            throw new Error(
                `Error updating shipper location: ${error.message}`
            );
        }
    }

    // Cập nhật trạng thái khả dụng shipper
    async updateAvailability(shipperId, isAvailable) {
        try {
            const shipper = await Shipper.findByIdAndUpdate(
                shipperId,
                { "workStatus.isAvailable": isAvailable },
                { new: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return shipper;
        } catch (error) {
            throw new Error(
                `Error updating shipper availability: ${error.message}`
            );
        }
    }

    // Cập nhật hiệu suất shipper
    async updatePerformance(shipperId, performanceData) {
        try {
            const shipper = await Shipper.findByIdAndUpdate(
                shipperId,
                { $inc: performanceData },
                { new: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return shipper;
        } catch (error) {
            throw new Error(
                `Error updating shipper performance: ${error.message}`
            );
        }
    }

    // Xác thực shipper
    async verifyShipper(shipperId, verifiedBy) {
        try {
            const shipper = await Shipper.findByIdAndUpdate(
                shipperId,
                {
                    "verificationStatus.isVerified": true,
                    "verificationStatus.verifiedAt": new Date(),
                    "verificationStatus.verifiedBy": verifiedBy,
                },
                { new: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return shipper;
        } catch (error) {
            throw new Error(`Error verifying shipper: ${error.message}`);
        }
    }

    // Lấy tất cả shippers với phân trang và lọc
    async getShippers(query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            isActive,
            isVerified,
            isAvailable,
            hubId,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        // Xây dựng object lọc
        const filter = { role: USER_ROLES.SHIPPER };

        if (isActive !== undefined) filter.isActive = isActive === "true";
        if (isVerified !== undefined)
            filter["verificationStatus.isVerified"] = isVerified === "true";
        if (isAvailable !== undefined)
            filter["workStatus.isAvailable"] = isAvailable === "true";
        if (hubId) filter.assignedHub = hubId;

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
            ];
        }

        // Xây dựng object sắp xếp
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Tính toán phân trang
        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const shippers = await Shipper.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .populate("assignedHub", "name address")
                .lean();

            const total = await Shipper.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                shippers,
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
            throw new Error(`Error fetching shippers: ${error.message}`);
        }
    }

    // Lấy shippers khả dụng gần vị trí
    async getAvailableShippersNearby(latitude, longitude, radius = 10) {
        try {
            const shippers = await Shipper.find({
                role: USER_ROLES.SHIPPER,
                isActive: true,
                "verificationStatus.isVerified": true,
                "workStatus.isAvailable": true,
                "workStatus.currentLocation.latitude": {
                    $gte: latitude - radius / 111, // Chuyển đổi gần đúng: 1 độ ≈ 111 km
                    $lte: latitude + radius / 111,
                },
                "workStatus.currentLocation.longitude": {
                    $gte: longitude - radius / 111,
                    $lte: longitude + radius / 111,
                },
            })
                .populate("assignedHub", "name address")
                .lean();

            return shippers;
        } catch (error) {
            throw new Error(
                `Error fetching available shippers: ${error.message}`
            );
        }
    }

    // Lấy thống kê shipper
    async getShipperStats() {
        try {
            const stats = await Shipper.aggregate([
                {
                    $group: {
                        _id: null,
                        totalShippers: { $sum: 1 },
                        activeShippers: {
                            $sum: {
                                $cond: [{ $eq: ["$isActive", true] }, 1, 0],
                            },
                        },
                        verifiedShippers: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$verificationStatus.isVerified",
                                            true,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        availableShippers: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$workStatus.isAvailable", true] },
                                    1,
                                    0,
                                ],
                            },
                        },
                        totalDeliveries: {
                            $sum: "$performance.totalDeliveries",
                        },
                        totalEarnings: { $sum: "$performance.totalEarnings" },
                        averageRating: { $avg: "$performance.averageRating" },
                    },
                },
            ]);

            const levelStats = await Shipper.aggregate([
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$performance.totalDeliveries",
                                                        1000,
                                                    ],
                                                },
                                                {
                                                    $gte: [
                                                        "$performance.averageRating",
                                                        4.5,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: "Expert",
                                    },
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$performance.totalDeliveries",
                                                        500,
                                                    ],
                                                },
                                                {
                                                    $gte: [
                                                        "$performance.averageRating",
                                                        4.0,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: "Advanced",
                                    },
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$performance.totalDeliveries",
                                                        100,
                                                    ],
                                                },
                                                {
                                                    $gte: [
                                                        "$performance.averageRating",
                                                        3.5,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: "Intermediate",
                                    },
                                ],
                                default: "Beginner",
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);

            return {
                ...stats[0],
                levelBreakdown: levelStats,
            };
        } catch (error) {
            throw new Error(`Error fetching shipper stats: ${error.message}`);
        }
    }

    // Lấy top shippers theo hiệu suất
    async getTopShippers(limit = 10) {
        try {
            const shippers = await Shipper.find({ role: USER_ROLES.SHIPPER })
                .sort({
                    "performance.averageRating": -1,
                    "performance.totalDeliveries": -1,
                })
                .limit(limit)
                .select("name email performance assignedHub")
                .populate("assignedHub", "name address")
                .lean();

            return shippers;
        } catch (error) {
            throw new Error(`Error fetching top shippers: ${error.message}`);
        }
    }

    // Xác thực thông tin đăng nhập shipper
    async verifyCredentials(email, password) {
        try {
            const shipper = await Shipper.findOne({ email });
            if (!shipper) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const isPasswordValid = await authService.comparePassword(
                password,
                shipper.password
            );
            if (!isPasswordValid) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            authService.checkUserActive(shipper);

            return shipper;
        } catch (error) {
            throw new Error(`Error verifying credentials: ${error.message}`);
        }
    }
}

export default new ShipperService();
