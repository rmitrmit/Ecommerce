/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên sản phẩm là bắt buộc"],
            trim: true,
            minlength: [5, "Tên sản phẩm phải có ít nhất 5 ký tự"],
            maxlength: [100, "Tên sản phẩm không được vượt quá 100 ký tự"],
        },
        price: {
            type: Number,
            required: [true, "Giá sản phẩm là bắt buộc"],
            min: [0, "Giá sản phẩm phải là số dương"],
            validate: {
                validator: function (price) {
                    return price > 0;
                },
                message: "Giá sản phẩm phải là số dương",
            },
        },
        images: [
            {
                type: String, // Mảng URL hoặc tên file
                required: [true, "Hình ảnh sản phẩm là bắt buộc"],
            },
        ],
        description: {
            type: String,
            required: [true, "Mô tả sản phẩm là bắt buộc"],
            trim: true,
            maxlength: [1000, "Mô tả sản phẩm không được vượt quá 1000 ký tự"],
        },
        category: {
            type: String,
            required: [true, "Danh mục sản phẩm là bắt buộc"],
            trim: true,
            minlength: [2, "Danh mục sản phẩm phải có ít nhất 2 ký tự"],
            maxlength: [50, "Danh mục sản phẩm không được quá 50 ký tự"],
        },
        stock: {
            type: Number,
            required: [true, "Số lượng tồn kho là bắt buộc"],
            min: [0, "Số lượng tồn kho không được âm"],
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "out_of_stock", "discontinued"],
            default: "active",
            required: [true, "Trạng thái sản phẩm là bắt buộc"],
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BaseUser",
            required: [true, "Vendor ID là bắt buộc"],
            validate: {
                validator: function (vendorId) {
                    return mongoose.Types.ObjectId.isValid(vendorId);
                },
                message: "Vendor ID không hợp lệ",
            },
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        weight: {
            type: Number,
            min: [0, "Trọng lượng không được âm"],
        },
        dimensions: {
            length: { type: Number, min: 0 },
            width: { type: Number, min: 0 },
            height: { type: Number, min: 0 },
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0, min: 0 },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Trường ảo
productSchema.virtual("isInStock").get(function () {
    return this.stock > 0 && this.status === "active";
});

productSchema.virtual("mainImage").get(function () {
    return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Index để tối ưu truy vấn
productSchema.index({ name: "text", description: "text" });
productSchema.index({ vendor: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "rating.average": -1 });
productSchema.index({ isFeatured: 1 });

export default mongoose.model("Product", productSchema);
