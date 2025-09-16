/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Customer } from "../models/index.js";
import authService from "./authService.js";
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    PAGINATION,
    USER_ROLES,
} from "../constants/index.js";

class CustomerService {
    // Tạo customer mới
    async createCustomer(customerData) {
        try {
            // Xác thực độ mạnh mật khẩu
            authService.validatePassword(customerData.password);

            // Mã hóa mật khẩu
            const hashedPassword = await authService.hashPassword(
                customerData.password
            );

            // Tạo customer
            const customer = new Customer({
                ...customerData,
                password: hashedPassword,
                role: USER_ROLES.CUSTOMER,
            });

            await customer.save();
            return customer;
        } catch (error) {
            throw new Error(`Error creating customer: ${error.message}`);
        }
    }

    // Lấy customer theo ID
    async getCustomerById(customerId) {
        try {
            const customer = await Customer.findById(customerId).lean();
            if (!customer) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return customer;
        } catch (error) {
            throw new Error(`Error fetching customer: ${error.message}`);
        }
    }

    // Lấy customer theo email
    async getCustomerByEmail(email) {
        try {
            const customer = await Customer.findOne({ email }).lean();
            if (!customer) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return customer;
        } catch (error) {
            throw new Error(`Error fetching customer: ${error.message}`);
        }
    }

    // Cập nhật customer
    async updateCustomer(customerId, updateData) {
        try {
            // Nếu cập nhật mật khẩu, mã hóa nó
            if (updateData.password) {
                authService.validatePassword(updateData.password);
                updateData.password = await authService.hashPassword(
                    updateData.password
                );
            }

            const customer = await Customer.findByIdAndUpdate(
                customerId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!customer) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return customer;
        } catch (error) {
            throw new Error(`Error updating customer: ${error.message}`);
        }
    }

    // Cập nhật tùy chọn customer
    async updatePreferences(customerId, preferences) {
        try {
            const customer = await Customer.findByIdAndUpdate(
                customerId,
                { preferences },
                { new: true, runValidators: true }
            );

            if (!customer) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return customer;
        } catch (error) {
            throw new Error(`Error updating preferences: ${error.message}`);
        }
    }

    // Thêm điểm thưởng
    async addLoyaltyPoints(customerId, points) {
        try {
            const customer = await Customer.findByIdAndUpdate(
                customerId,
                { $inc: { loyaltyPoints: points } },
                { new: true }
            );

            if (!customer) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return customer;
        } catch (error) {
            throw new Error(`Error adding loyalty points: ${error.message}`);
        }
    }

    // Cập nhật thống kê customer sau đơn hàng
    async updateOrderStats(customerId, orderValue) {
        try {
            await Customer.findByIdAndUpdate(customerId, {
                $inc: {
                    totalOrders: 1,
                    totalSpent: orderValue,
                },
            });
        } catch (error) {
            throw new Error(`Error updating order stats: ${error.message}`);
        }
    }

    // Lấy tất cả customers với phân trang và lọc
    async getCustomers(query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            isActive,
            search,
            loyaltyLevel,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        // Xây dựng object lọc
        const filter = { role: USER_ROLES.CUSTOMER };

        if (isActive !== undefined) filter.isActive = isActive === "true";

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
            const customers = await Customer.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean();

            const total = await Customer.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                customers,
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
            throw new Error(`Error fetching customers: ${error.message}`);
        }
    }

    // Lấy thống kê customer
    async getCustomerStats() {
        try {
            const stats = await Customer.aggregate([
                {
                    $group: {
                        _id: null,
                        totalCustomers: { $sum: 1 },
                        activeCustomers: {
                            $sum: {
                                $cond: [{ $eq: ["$isActive", true] }, 1, 0],
                            },
                        },
                        totalLoyaltyPoints: { $sum: "$loyaltyPoints" },
                        totalSpent: { $sum: "$totalSpent" },
                        averageOrderValue: { $avg: "$totalSpent" },
                    },
                },
            ]);

            const loyaltyLevelStats = await Customer.aggregate([
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $gte: ["$loyaltyPoints", 10000],
                                        },
                                        then: "Gold",
                                    },
                                    {
                                        case: {
                                            $gte: ["$loyaltyPoints", 5000],
                                        },
                                        then: "Silver",
                                    },
                                    {
                                        case: {
                                            $gte: ["$loyaltyPoints", 1000],
                                        },
                                        then: "Bronze",
                                    },
                                ],
                                default: "New",
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);

            return {
                ...stats[0],
                loyaltyLevelBreakdown: loyaltyLevelStats,
            };
        } catch (error) {
            throw new Error(`Error fetching customer stats: ${error.message}`);
        }
    }

    // Xác thực thông tin đăng nhập customer
    async verifyCredentials(email, password) {
        try {
            const customer = await Customer.findOne({ email });
            if (!customer) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const isPasswordValid = await authService.comparePassword(
                password,
                customer.password
            );
            if (!isPasswordValid) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            authService.checkUserActive(customer);

            return customer;
        } catch (error) {
            throw new Error(`Error verifying credentials: ${error.message}`);
        }
    }

    // Lấy top customers theo chi tiêu
    async getTopCustomers(limit = 10) {
        try {
            const customers = await Customer.find({ role: USER_ROLES.CUSTOMER })
                .sort({ totalSpent: -1 })
                .limit(limit)
                .select("name email totalSpent totalOrders loyaltyPoints")
                .lean();

            return customers;
        } catch (error) {
            throw new Error(`Error fetching top customers: ${error.message}`);
        }
    }
}

export default new CustomerService();
