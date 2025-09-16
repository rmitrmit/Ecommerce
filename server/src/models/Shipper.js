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

const shipperSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Họ tên là bắt buộc"],
            trim: true,
            minlength: [2, "Họ tên phải có ít nhất 2 ký tự"],
            maxlength: [100, "Họ tên không được vượt quá 100 ký tự"],
        },
        idCard: {
            type: String,
            required: [true, "Số CMND/CCCD là bắt buộc"],
            unique: true,
            trim: true,
            match: [/^[0-9]{9,12}$/, "Số CMND/CCCD không hợp lệ"],
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Ngày sinh là bắt buộc"],
            validate: {
                validator: function (date) {
                    const age =
                        (new Date() - date) / (365.25 * 24 * 60 * 60 * 1000);
                    return age >= 18 && age <= 65;
                },
                message: "Tuổi phải từ 18 đến 65",
            },
        },
        address: {
            type: String,
            required: [true, "Địa chỉ là bắt buộc"],
            trim: true,
            minlength: [5, "Địa chỉ phải có ít nhất 5 ký tự"],
            maxlength: [500, "Địa chỉ không được vượt quá 500 ký tự"],
        },
        assignedHub: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DistributionHub",
            required: [true, "Hub được gán là bắt buộc"],
        },
        vehicleInfo: {
            type: {
                type: String,
                required: [true, "Loại phương tiện là bắt buộc"],
                enum: ["motorcycle", "bicycle", "car", "truck"],
            },
            licensePlate: {
                type: String,
                required: [true, "Biển số xe là bắt buộc"],
                trim: true,
            },
            brand: String,
            model: String,
            year: {
                type: Number,
                min: [1990, "Năm sản xuất không hợp lệ"],
                max: [new Date().getFullYear(), "Năm sản xuất không hợp lệ"],
            },
        },
        documents: [
            {
                type: {
                    type: String,
                    enum: [
                        "id_card",
                        "driving_license",
                        "vehicle_registration",
                        "insurance",
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
        workStatus: {
            isAvailable: {
                type: Boolean,
                default: true,
            },
            currentLocation: {
                latitude: Number,
                longitude: Number,
                address: String,
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
            workingHours: {
                start: {
                    type: String,
                    default: "08:00",
                    match: [
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                        "Giờ làm việc không hợp lệ",
                    ],
                },
                end: {
                    type: String,
                    default: "17:00",
                    match: [
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                        "Giờ làm việc không hợp lệ",
                    ],
                },
            },
        },
        performance: {
            totalDeliveries: {
                type: Number,
                default: 0,
                min: [0, "Tổng giao hàng không được âm"],
            },
            successfulDeliveries: {
                type: Number,
                default: 0,
                min: [0, "Giao hàng thành công không được âm"],
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
            totalEarnings: {
                type: Number,
                default: 0,
                min: [0, "Tổng thu nhập không được âm"],
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
            verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BaseUser",
            },
        },
        emergencyContact: {
            name: {
                type: String,
                required: [true, "Tên người liên hệ khẩn cấp là bắt buộc"],
            },
            phone: {
                type: String,
                required: [true, "Số điện thoại liên hệ khẩn cấp là bắt buộc"],
                match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
            },
            relationship: {
                type: String,
                required: [true, "Mối quan hệ là bắt buộc"],
                enum: ["parent", "spouse", "sibling", "friend", "other"],
            },
        },
    },
    {
        timestamps: true,
    }
);

// Trường ảo
shipperSchema.virtual("successRate").get(function () {
    return this.performance.totalDeliveries > 0
        ? (this.performance.successfulDeliveries /
              this.performance.totalDeliveries) *
              100
        : 0;
});

shipperSchema.virtual("isVerified").get(function () {
    return this.verificationStatus.isVerified;
});

shipperSchema.virtual("shipperLevel").get(function () {
    if (
        this.performance.totalDeliveries >= 1000 &&
        this.performance.averageRating >= 4.5
    )
        return "Expert";
    if (
        this.performance.totalDeliveries >= 500 &&
        this.performance.averageRating >= 4.0
    )
        return "Advanced";
    if (
        this.performance.totalDeliveries >= 100 &&
        this.performance.averageRating >= 3.5
    )
        return "Intermediate";
    return "Beginner";
});

shipperSchema.virtual("age").get(function () {
    return Math.floor(
        (new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000)
    );
});

// Indexes
shipperSchema.index({ name: 1 });
shipperSchema.index({ idCard: 1 });
shipperSchema.index({ assignedHub: 1 });
shipperSchema.index({ "workStatus.isAvailable": 1 });
shipperSchema.index({ "verificationStatus.isVerified": 1 });
shipperSchema.index({ "performance.averageRating": -1 });
shipperSchema.index({ "performance.totalDeliveries": -1 });
shipperSchema.index({
    "workStatus.currentLocation.latitude": 1,
    "workStatus.currentLocation.longitude": 1,
});

export default BaseUser.discriminator("Shipper", shipperSchema);
