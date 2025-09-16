/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";

const distributionHubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên hub là bắt buộc"],
            unique: true,
            trim: true,
            minlength: [5, "Tên hub phải có ít nhất 5 ký tự"],
            maxlength: [100, "Tên hub không được vượt quá 100 ký tự"],
        },
        address: {
            type: String,
            required: [true, "Địa chỉ hub là bắt buộc"],
            trim: true,
            minlength: [5, "Địa chỉ hub phải có ít nhất 5 ký tự"],
            maxlength: [500, "Địa chỉ hub không được vượt quá 500 ký tự"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Index để tối ưu truy vấn
distributionHubSchema.index({ name: 1 });
distributionHubSchema.index({ address: 1 });

export default mongoose.model("DistributionHub", distributionHubSchema);
