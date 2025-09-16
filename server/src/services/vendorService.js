/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Vendor, BaseUser } from "../models/index.js";
import authService from "./authService.js";
import { ERROR_MESSAGES, PAGINATION, USER_ROLES } from "../constants/index.js";

class VendorService {
    // Tạo vendor mới
    async createVendor(vendorData) {
        try {
            // Xác thực độ mạnh mật khẩu
            authService.validatePassword(vendorData.password);

            // Mã hóa mật khẩu
            const hashedPassword = await authService.hashPassword(
                vendorData.password
            );

            // Tạo vendor với chỉ các field cần thiết
            const vendorDataForCreation = {
                username: vendorData.username,
                email: vendorData.email,
                password: hashedPassword,
                role: USER_ROLES.VENDOR,
                businessName: vendorData.businessName,
                businessAddress: vendorData.businessAddress,
            };

            // Thêm các field optional nếu có
            if (vendorData.businessLicense) {
                vendorDataForCreation.businessLicense =
                    vendorData.businessLicense;
            }
            if (vendorData.taxCode) {
                vendorDataForCreation.taxCode = vendorData.taxCode;
            }
            if (vendorData.contactPerson) {
                vendorDataForCreation.contactPerson = vendorData.contactPerson;
            }
            if (vendorData.businessType) {
                vendorDataForCreation.businessType = vendorData.businessType;
            }
            if (vendorData.categories) {
                vendorDataForCreation.categories = vendorData.categories;
            }
            if (vendorData.bankAccount) {
                vendorDataForCreation.bankAccount = vendorData.bankAccount;
            }
            if (vendorData.businessDescription) {
                vendorDataForCreation.businessDescription =
                    vendorData.businessDescription;
            }
            if (vendorData.website) {
                vendorDataForCreation.website = vendorData.website;
            }
            if (vendorData.socialMedia) {
                vendorDataForCreation.socialMedia = vendorData.socialMedia;
            }

            const vendor = new Vendor(vendorDataForCreation);

            await vendor.save();
            return vendor;
        } catch (error) {
            throw new Error(`Error creating vendor: ${error.message}`);
        }
    }

    // Lấy vendor theo ID
    async getVendorById(vendorId) {
        try {
            const vendor = await Vendor.findById(vendorId).lean();
            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return vendor;
        } catch (error) {
            throw new Error(`Error fetching vendor: ${error.message}`);
        }
    }

    // Lấy vendor theo email
    async getVendorByEmail(email) {
        try {
            const vendor = await Vendor.findOne({ email }).lean();
            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return vendor;
        } catch (error) {
            throw new Error(`Error fetching vendor: ${error.message}`);
        }
    }

    // Lấy vendor theo tên doanh nghiệp
    async getVendorByBusinessName(businessName) {
        try {
            const vendor = await Vendor.findOne({ businessName }).lean();
            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return vendor;
        } catch (error) {
            throw new Error(`Error fetching vendor: ${error.message}`);
        }
    }

    // Cập nhật vendor
    async updateVendor(vendorId, updateData) {
        try {
            // Nếu cập nhật mật khẩu, mã hóa nó
            if (updateData.password) {
                authService.validatePassword(updateData.password);
                updateData.password = await authService.hashPassword(
                    updateData.password
                );
            }

            const vendor = await Vendor.findByIdAndUpdate(
                vendorId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return vendor;
        } catch (error) {
            throw new Error(`Error updating vendor: ${error.message}`);
        }
    }

    // Xác thực vendor
    async verifyVendor(vendorId, verifiedBy) {
        try {
            const vendor = await Vendor.findByIdAndUpdate(
                vendorId,
                {
                    "verificationStatus.isVerified": true,
                    "verificationStatus.verifiedAt": new Date(),
                    "verificationStatus.verifiedBy": verifiedBy,
                },
                { new: true }
            );

            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return vendor;
        } catch (error) {
            throw new Error(`Error verifying vendor: ${error.message}`);
        }
    }

    // Cập nhật thống kê vendor
    async updateStats(vendorId, stats) {
        try {
            const vendor = await Vendor.findByIdAndUpdate(
                vendorId,
                { $inc: stats },
                { new: true }
            );

            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return vendor;
        } catch (error) {
            throw new Error(`Error updating vendor stats: ${error.message}`);
        }
    }

    // Lấy tất cả vendors với phân trang và lọc
    async getVendors(query = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            isActive,
            isVerified,
            category,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = query;

        // Xây dựng object lọc
        const filter = { role: USER_ROLES.VENDOR };

        if (isActive !== undefined) filter.isActive = isActive === "true";
        if (isVerified !== undefined)
            filter["verificationStatus.isVerified"] = isVerified === "true";
        if (category) filter.categories = category;

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { businessName: { $regex: search, $options: "i" } },
            ];
        }

        // Xây dựng object sắp xếp
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Tính toán phân trang
        const skip = (parseInt(page) - 1) * parseInt(limit);

        try {
            const vendors = await Vendor.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean();

            const total = await Vendor.countDocuments(filter);
            const totalPages = Math.ceil(total / parseInt(limit));

            return {
                vendors,
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
            throw new Error(`Error fetching vendors: ${error.message}`);
        }
    }

    // Lấy thống kê vendor
    async getVendorStats() {
        try {
            const stats = await Vendor.aggregate([
                {
                    $group: {
                        _id: null,
                        totalVendors: { $sum: 1 },
                        activeVendors: {
                            $sum: {
                                $cond: [{ $eq: ["$isActive", true] }, 1, 0],
                            },
                        },
                        verifiedVendors: {
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
                        totalProducts: { $sum: "$businessStats.totalProducts" },
                        totalRevenue: { $sum: "$businessStats.totalRevenue" },
                        averageRating: { $avg: "$businessStats.averageRating" },
                    },
                },
            ]);

            const categoryStats = await Vendor.aggregate([
                { $unwind: "$categories" },
                {
                    $group: {
                        _id: "$categories",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]);

            const businessLevelStats = await Vendor.aggregate([
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $gte: [
                                                "$businessStats.totalRevenue",
                                                1000000,
                                            ],
                                        },
                                        then: "Premium",
                                    },
                                    {
                                        case: {
                                            $gte: [
                                                "$businessStats.totalRevenue",
                                                500000,
                                            ],
                                        },
                                        then: "Gold",
                                    },
                                    {
                                        case: {
                                            $gte: [
                                                "$businessStats.totalRevenue",
                                                100000,
                                            ],
                                        },
                                        then: "Silver",
                                    },
                                ],
                                default: "Bronze",
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);

            return {
                ...stats[0],
                categoryBreakdown: categoryStats,
                businessLevelBreakdown: businessLevelStats,
            };
        } catch (error) {
            throw new Error(`Error fetching vendor stats: ${error.message}`);
        }
    }

    // Lấy top vendors theo doanh thu
    async getTopVendors(limit = 10) {
        try {
            const vendors = await Vendor.find({ role: USER_ROLES.VENDOR })
                .sort({ "businessStats.totalRevenue": -1 })
                .limit(limit)
                .select("businessName email businessStats categories")
                .lean();

            return vendors;
        } catch (error) {
            throw new Error(`Error fetching top vendors: ${error.message}`);
        }
    }

    // Xác thực thông tin đăng nhập vendor
    async verifyCredentials(email, password) {
        try {
            const vendor = await Vendor.findOne({ email });
            if (!vendor) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const isPasswordValid = await authService.comparePassword(
                password,
                vendor.password
            );
            if (!isPasswordValid) {
                throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            authService.checkUserActive(vendor);

            return vendor;
        } catch (error) {
            throw new Error(`Error verifying credentials: ${error.message}`);
        }
    }

    // Cập nhật cài đặt vendor
    async updateSettings(vendorId, settings) {
        try {
            const vendor = await Vendor.findByIdAndUpdate(
                vendorId,
                { settings },
                { new: true, runValidators: true }
            );

            if (!vendor) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            return vendor;
        } catch (error) {
            throw new Error(`Error updating vendor settings: ${error.message}`);
        }
    }
}

export default new VendorService();
