/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            max: 99,
        },
        priceAtTime: {
            type: Number,
            required: true,
            min: 0,
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BaseUser",
            required: true,
            unique: true,
            index: true,
        },
        items: [cartItemSchema],
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Virtual fields
cartSchema.virtual("totalItems").get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual("totalAmount").get(function () {
    return this.items.reduce(
        (total, item) => total + item.priceAtTime * item.quantity,
        0
    );
});

cartSchema.virtual("isEmpty").get(function () {
    return this.items.length === 0;
});

// Indexes for performance
cartSchema.index({ userId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Ensure virtual fields are included in JSON output
cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
