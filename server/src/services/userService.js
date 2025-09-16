/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { BaseUser, DistributionHub } from "../models/index.js";
import authService from "./authService.js";
import { USER_ROLES, ERROR_MESSAGES, PAGINATION } from "../constants/index.js";

class UserService {
    // Tạo user mới
    async createUser(userData) {
        try {
            // Xác thực độ mạnh mật khẩu
            authService.validatePassword(userData.password);

            // Mã hóa mật khẩu
            const hashedPassword = await authService.hashPassword(
                userData.password
            );

            // Tạo user
            const user = new BaseUser({
                ...userData,
                password: hashedPassword,
            });

            await user.save();
            return user;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Lấy user theo ID
    async getUserById(userId) {
        try {
            const user = await BaseUser.findById(userId).lean();
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    // Lấy user theo email
    async getUserByEmail(email) {
        try {
            const user = await BaseUser.findOne({ email }).lean();
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    // Lấy user theo username
    async getUserByUsername(username) {
        try {
            const user = await BaseUser.findOne({ username }).lean();
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    // Cập nhật user
    async updateUser(userId, updateData) {
        try {
            // Nếu cập nhật mật khẩu, mã hóa nó
            if (updateData.password) {
                authService.validatePassword(updateData.password);
                updateData.password = await authService.hashPassword(
                    updateData.password
                );
            }

            const user = await BaseUser.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            });

            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return user;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Delete user (soft delete)
    async deleteUser(userId) {
        try {
            const user = await BaseUser.findByIdAndUpdate(
                userId,
                { isActive: false },
                { new: true }
            );

            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return user;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    // Get all users with pagination and filtering
    async getUsers(query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            role,
            isActive,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        // Build filter object
        const filter = {};

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === "true";

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { businessName: { $regex: search, $options: "i" } },
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const users = await BaseUser.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .populate("assignedHub", "name address")
                .lean();

            const total = await BaseUser.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                users,
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
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }

    // Get users by role
    async getUsersByRole(role, query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            isActive,
        } = query;

        const filter = { role };
        if (isActive !== undefined) filter.isActive = isActive === "true";

        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const users = await BaseUser.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate("assignedHub", "name address")
                .lean();

            const total = await BaseUser.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                users,
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
            throw new Error(`Error fetching users by role: ${error.message}`);
        }
    }

    // Update user status
    async updateUserStatus(userId, isActive) {
        try {
            const user = await BaseUser.findByIdAndUpdate(
                userId,
                { isActive },
                { new: true }
            );

            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return user;
        } catch (error) {
            throw new Error(`Error updating user status: ${error.message}`);
        }
    }

    // Update last login
    async updateLastLogin(userId) {
        try {
            await BaseUser.findByIdAndUpdate(userId, {
                lastLogin: new Date(),
            });
        } catch (error) {
            throw new Error(`Error updating last login: ${error.message}`);
        }
    }

    // Get user statistics
    async getUserStats() {
        try {
            const stats = await BaseUser.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: { $sum: 1 },
                        activeCount: {
                            $sum: {
                                $cond: [{ $eq: ["$isActive", true] }, 1, 0],
                            },
                        },
                    },
                },
            ]);

            const totalUsers = await BaseUser.countDocuments();
            const activeUsers = await BaseUser.countDocuments({
                isActive: true,
            });

            return {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
                roleBreakdown: stats,
            };
        } catch (error) {
            throw new Error(`Error fetching user stats: ${error.message}`);
        }
    }

    // Assign shipper to hub
    async assignShipperToHub(shipperId, hubId) {
        try {
            // Verify hub exists
            const hub = await DistributionHub.findById(hubId);
            if (!hub) {
                throw new Error("Distribution hub not found");
            }

            // Update shipper
            const shipper = await BaseUser.findByIdAndUpdate(
                shipperId,
                { assignedHub: hubId },
                { new: true }
            );

            if (!shipper) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            if (shipper.role !== USER_ROLES.SHIPPER) {
                throw new Error("User is not a shipper");
            }

            return shipper;
        } catch (error) {
            throw new Error(`Error assigning shipper to hub: ${error.message}`);
        }
    }

    // Verify user credentials
    async verifyCredentials(email, password) {
        try {
            const user = await BaseUser.findOne({ email });
            if (!user) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const isPasswordValid = await authService.comparePassword(
                password,
                user.password
            );
            if (!isPasswordValid) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            authService.checkUserActive(user);

            return user;
        } catch (error) {
            throw new Error(`Error verifying credentials: ${error.message}`);
        }
    }
}

export default new UserService();
