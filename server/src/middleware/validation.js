/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { body, validationResult } from "express-validator";

// Helper function to check for validation errors
export const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Invalid data",
            details: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// Validation rules for registration
export const registerValidation = [
    body("username")
        .isLength({ min: 8, max: 15 })
        .withMessage("Username must be between 8-15 characters")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username can only contain letters and numbers"),
    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8-20 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .withMessage(
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)"
        ),
    body("userType")
        .optional()
        .isIn(["vendor", "customer", "shipper"])
        .withMessage("Invalid user type"),
];

// Used for specific role-based registration routes
export const registerCommonValidation = [
    body("username")
        .isLength({ min: 8, max: 15 })
        .withMessage("Username must be between 8-15 characters")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username can only contain letters and numbers"),
    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8-20 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .withMessage(
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)"
        ),
];

// Validation rules for vendors
export const vendorValidation = [
    body("businessName")
        .isLength({ min: 5, max: 100 })
        .withMessage("Business name must be between 5-100 characters"),
    body("businessAddress")
        .isLength({ min: 5, max: 500 })
        .withMessage("Business address must be between 5-500 characters"),
];

// Validation rules for customers
export const customerValidation = [
    body("name")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2-100 characters"),
    body("address")
        .isLength({ min: 5, max: 500 })
        .withMessage("Address must be between 5-500 characters"),
];

// Validation rules for shippers
export const shipperValidation = [
    body("assignedHub").isMongoId().withMessage("Assigned hub is not valid"),
];

// Validation rules for login
export const loginValidation = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for products
export const productValidation = [
    body("name")
        .isLength({ min: 10, max: 20 })
        .withMessage("Product name must be between 10-20 characters"),
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Product price must be a positive number"),
    body("description")
        .isLength({ max: 500 })
        .withMessage("Product description cannot exceed 500 characters"),
    body("category")
        .isLength({ min: 2, max: 50 })
        .withMessage("Product category must be between 2-50 characters"),
    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock quantity must be a non-negative integer"),
    body("image").custom((value, { req }) => {
        // req.file is populated by the multer middleware
        if (!req.file) {
            throw new Error("Product image is required.");
        }
        return true;
    }),
];

// Validation rules for orders
export const orderValidation = [
    body("customerAddress")
        .isLength({ min: 5, max: 500 })
        .withMessage("Customer address must be between 5-500 characters"),
];