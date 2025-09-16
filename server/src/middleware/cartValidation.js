/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import mongoose from "mongoose";

// Validate cart item input
export const validateCartItem = (req, res, next) => {
    const { productId, quantity } = req.body;
    const errors = [];

    // Validate productId
    if (!productId) {
        errors.push("Product ID is required");
    } else if (!mongoose.Types.ObjectId.isValid(productId)) {
        errors.push("Invalid Product ID");
    }

    // Validate quantity
    if (quantity === undefined || quantity === null) {
        errors.push("Quantity is required");
    } else if (!Number.isInteger(quantity) || quantity < 1) {
        errors.push("Quantity must be a positive integer");
    } else if (quantity > 99) {
        errors.push("Quantity cannot exceed 99");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: "Invalid data",
            details: errors,
        });
    }

    next();
};

// Validate productId parameter
export const validateProductId = (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({
            success: false,
            error: "Product ID is required",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid Product ID",
        });
    }

    next();
};

// Validate quantity for update
export const validateQuantity = (req, res, next) => {
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
        return res.status(400).json({
            success: false,
            error: "Quantity is required",
        });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            success: false,
            error: "Quantity must be a non-negative integer",
        });
    }

    if (quantity > 99) {
        return res.status(400).json({
            success: false,
            error: "Quantity cannot exceed 99",
        });
    }

    next();
};