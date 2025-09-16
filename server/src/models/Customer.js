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

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Họ tên là bắt buộc"],
            trim: true,
            minlength: [2, "Họ tên phải có ít nhất 2 ký tự"],
            maxlength: [100, "Họ tên không được vượt quá 100 ký tự"],
        },
        address: {
            type: String,
            required: [true, "Địa chỉ là bắt buộc"],
            trim: true,
            minlength: [5, "Địa chỉ phải có ít nhất 5 ký tự"],
            maxlength: [500, "Địa chỉ không được vượt quá 500 ký tự"],
        },
        dateOfBirth: {
            type: Date,
            validate: {
                validator: function (date) {
                    return date < new Date();
                },
                message: "Ngày sinh phải trong quá khứ",
            },
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        preferences: {
            categories: [String],
            notifications: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
                push: { type: Boolean, default: true },
            },
        },
        loyaltyPoints: {
            type: Number,
            default: 0,
            min: [0, "Điểm thưởng không được âm"],
        },
        totalOrders: {
            type: Number,
            default: 0,
            min: [0, "Tổng đơn hàng không được âm"],
        },
        totalSpent: {
            type: Number,
            default: 0,
            min: [0, "Tổng chi tiêu không được âm"],
        },
    },
    {
        timestamps: true,
    }
);

// Trường ảo
customerSchema.virtual("loyaltyLevel").get(function () {
    if (this.loyaltyPoints >= 10000) return "Gold";
    if (this.loyaltyPoints >= 5000) return "Silver";
    if (this.loyaltyPoints >= 1000) return "Bronze";
    return "New";
});

customerSchema.virtual("averageOrderValue").get(function () {
    return this.totalOrders > 0 ? this.totalSpent / this.totalOrders : 0;
});

// Indexes
customerSchema.index({ name: 1 });
customerSchema.index({ loyaltyPoints: -1 });
customerSchema.index({ totalSpent: -1 });
customerSchema.index({ "preferences.categories": 1 });

export default BaseUser.discriminator("Customer", customerSchema);
