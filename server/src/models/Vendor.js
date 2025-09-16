/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const vendorSchema = new mongoose.Schema(
    {
        // Thông tin cơ bản - BẮT BUỘC khi đăng ký
        businessName: {
            type: String,
            required: [true, "Tên doanh nghiệp là bắt buộc"],
            trim: true,
            minlength: [2, "Tên doanh nghiệp phải có ít nhất 2 ký tự"],
            maxlength: [100, "Tên doanh nghiệp không được vượt quá 100 ký tự"],
            unique: true,
        },
        businessAddress: {
            type: String,
            required: [true, "Địa chỉ doanh nghiệp là bắt buộc"],
            trim: true,
            minlength: [5, "Địa chỉ doanh nghiệp phải có ít nhất 5 ký tự"],
            maxlength: [
                500,
                "Địa chỉ doanh nghiệp không được vượt quá 500 ký tự",
            ],
        },

        // Thông tin bổ sung - CÓ THỂ CẬP NHẬT SAU
        businessLicense: {
            type: String,
            required: false, // Không bắt buộc khi đăng ký
            unique: true,
            sparse: true, // Cho phép null/undefined
            trim: true,
        },
        taxCode: {
            type: String,
            required: false, // Không bắt buộc khi đăng ký
            unique: true,
            sparse: true, // Cho phép null/undefined
            trim: true,
        },
        contactPerson: {
            name: {
                type: String,
                required: false, // Không bắt buộc khi đăng ký
                trim: true,
            },
            position: {
                type: String,
                required: false, // Không bắt buộc khi đăng ký
                trim: true,
            },
            phone: {
                type: String,
                required: false,
                trim: true,
                match: [/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"],
            },
        },
        businessType: {
            type: String,
            required: false, // Không bắt buộc khi đăng ký
            enum: ["individual", "company", "cooperative"],
            default: "individual",
        },
        categories: [
            {
                type: String,
                enum: [
                    "electronics",
                    "clothing",
                    "books",
                    "home",
                    "sports",
                    "beauty",
                    "toys",
                    "food",
                    "other",
                ],
            },
        ],
        bankAccount: {
            bankName: {
                type: String,
                required: false, // Không bắt buộc khi đăng ký
            },
            accountNumber: {
                type: String,
                required: false, // Không bắt buộc khi đăng ký
            },
            accountHolder: {
                type: String,
                required: false, // Không bắt buộc khi đăng ký
            },
        },
        // Thông tin bổ sung khác
        businessDescription: {
            type: String,
            required: false,
            maxlength: [
                1000,
                "Mô tả doanh nghiệp không được vượt quá 1000 ký tự",
            ],
        },
        website: {
            type: String,
            required: false,
            match: [
                /^https?:\/\/.+/,
                "Website phải bắt đầu bằng http:// hoặc https://",
            ],
        },
        socialMedia: {
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            tiktok: { type: String, required: false },
        },
        businessStats: {
            totalProducts: {
                type: Number,
                default: 0,
                min: [0, "Tổng sản phẩm không được âm"],
            },
            totalOrders: {
                type: Number,
                default: 0,
                min: [0, "Tổng đơn hàng không được âm"],
            },
            totalRevenue: {
                type: Number,
                default: 0,
                min: [0, "Tổng doanh thu không được âm"],
            },
            averageRating: {
                type: Number,
                default: 0,
                min: [0, "Đánh giá trung bình không được âm"],
                max: [5, "Đánh giá trung bình không được vượt quá 5"],
            },
            totalReviews: {
                type: Number,
                default: 0,
                min: [0, "Tổng đánh giá không được âm"],
            },
        },
        verificationStatus: {
            isVerified: {
                type: Boolean,
                default: false,
            },
            verifiedAt: {
                type: Date,
                default: null,
            },
            documents: [
                {
                    type: {
                        type: String,
                        enum: [
                            "business_license",
                            "tax_certificate",
                            "bank_statement",
                            "id_card",
                        ],
                    },
                    url: String,
                    uploadedAt: {
                        type: Date,
                        default: Date.now,
                    },
                    status: {
                        type: String,
                        enum: ["pending", "approved", "rejected"],
                        default: "pending",
                    },
                },
            ],
        },
        settings: {
            autoAcceptOrders: {
                type: Boolean,
                default: false,
            },
            notificationPreferences: {
                newOrder: { type: Boolean, default: true },
                orderUpdate: { type: Boolean, default: true },
                payment: { type: Boolean, default: true },
                review: { type: Boolean, default: true },
            },
        },
    },
    {
        timestamps: true,
    }
);

// Trường ảo
vendorSchema.virtual("isVerified").get(function () {
    return this.verificationStatus.isVerified;
});

vendorSchema.virtual("averageOrderValue").get(function () {
    return this.businessStats.totalOrders > 0
        ? this.businessStats.totalRevenue / this.businessStats.totalOrders
        : 0;
});

vendorSchema.virtual("businessLevel").get(function () {
    if (this.businessStats.totalRevenue >= 1000000) return "Premium";
    if (this.businessStats.totalRevenue >= 500000) return "Gold";
    if (this.businessStats.totalRevenue >= 100000) return "Silver";
    return "Bronze";
});

// Indexes
vendorSchema.index({ businessName: 1 });
vendorSchema.index({ businessLicense: 1 }, { sparse: true }); // Sparse index cho unique field có thể null
vendorSchema.index({ taxCode: 1 }, { sparse: true }); // Sparse index cho unique field có thể null
vendorSchema.index({ categories: 1 });
vendorSchema.index({ "verificationStatus.isVerified": 1 });
vendorSchema.index({ "businessStats.totalRevenue": -1 });
vendorSchema.index({ "businessStats.averageRating": -1 });
vendorSchema.index({ businessType: 1 });

export default BaseUser.discriminator("Vendor", vendorSchema);
