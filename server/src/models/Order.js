/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID là bắt buộc"],
    },
    quantity: {
        type: Number,
        required: [true, "Số lượng là bắt buộc"],
        min: [1, "Số lượng phải lớn hơn 0"],
    },
    price: {
        type: Number,
        required: [true, "Giá sản phẩm là bắt buộc"],
        min: [0, "Giá sản phẩm không được âm"],
    },
});

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BaseUser",
            required: [true, "Customer ID là bắt buộc"],
        },
        products: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: [true, "Tổng tiền là bắt buộc"],
            min: [0, "Tổng tiền không được âm"],
        },
        customerAddress: {
            type: String,
            required: [true, "Địa chỉ khách hàng là bắt buộc"],
            trim: true,
            minlength: [5, "Địa chỉ phải có ít nhất 5 ký tự"],
            maxlength: [500, "Địa chỉ không được vượt quá 500 ký tự"],
        },
        assignedHub: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DistributionHub",
            required: [true, "Hub được gán là bắt buộc"],
        },
        status: {
            type: String,
            enum: ["active", "delivered", "canceled"],
            default: "active",
            required: [true, "Trạng thái đơn hàng là bắt buộc"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
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

// Middleware cập nhật updatedAt
orderSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Trường ảo
orderSchema.virtual("orderNumber").get(function () {
    return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

orderSchema.virtual("itemCount").get(function () {
    return this.products.reduce((total, item) => total + item.quantity, 0);
});

// Index để tối ưu truy vấn
orderSchema.index({ customerId: 1 });
orderSchema.index({ assignedHub: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ updatedAt: -1 });

export default mongoose.model("Order", orderSchema);
