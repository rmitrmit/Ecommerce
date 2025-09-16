/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";

const baseUserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Tên đăng nhập là bắt buộc"],
            unique: true,
            trim: true,
            minlength: [8, "Tên đăng nhập phải có ít nhất 8 ký tự"],
            maxlength: [15, "Tên đăng nhập không được vượt quá 15 ký tự"],
            match: [
                /^[a-zA-Z0-9]+$/,
                "Tên đăng nhập chỉ được chứa chữ cái và số",
            ],
        },
        email: {
            type: String,
            required: [true, "Email là bắt buộc"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Email không hợp lệ",
            ],
        },
        password: {
            type: String,
            required: [true, "Mật khẩu là bắt buộc"],
            minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
            maxlength: [128, "Mật khẩu không được vượt quá 128 ký tự"],
        },
        profilePicture: {
            type: String, // URL hoặc tên file
            default: null,
        },
        role: {
            type: String,
            enum: [
                "customer",
                "vendor",
                "shipper",
                "Customer",
                "Vendor",
                "Shipper",
            ],
            required: [true, "Vai trò người dùng là bắt buộc"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.password;
                return ret;
            },
        },
        toObject: { virtuals: true },
        discriminatorKey: "role", // Key để phân biệt các loại user
    }
);

// Trường ảo
baseUserSchema.virtual("fullName").get(function () {
    return this.name || this.businessName || this.username;
});

// Index để tối ưu truy vấn
baseUserSchema.index({ username: 1 });
baseUserSchema.index({ email: 1 });
baseUserSchema.index({ role: 1 });
baseUserSchema.index({ isActive: 1 });

export default mongoose.model("BaseUser", baseUserSchema);
