/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

// Validation utilities

// Username validation (8-15 characters, letters and numbers only)
export const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, message: "Please enter a username" };
    }

    if (username.length < 8 || username.length > 15) {
        return {
            isValid: false,
            message: "Username must be 8-15 characters long",
        };
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return {
            isValid: false,
            message: "Username can only contain letters and numbers",
        };
    }

    return { isValid: true, message: "" };
};

// Password validation (8-20 characters, must contain uppercase, lowercase, number, and special character)
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: "Please enter a password" };
    }

    if (password.length < 8 || password.length > 20) {
        return {
            isValid: false,
            message: "Password must be 8-20 characters long",
        };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase) {
        return {
            isValid: false,
            message: "Password must contain at least 1 uppercase letter",
        };
    }

    if (!hasLowerCase) {
        return {
            isValid: false,
            message: "Password must contain at least 1 lowercase letter",
        };
    }

    if (!hasDigit) {
        return {
            isValid: false,
            message: "Password must contain at least 1 number",
        };
    }

    if (!hasSpecialChar) {
        return {
            isValid: false,
            message: "Password must contain at least 1 special character (!@#$%^&*)",
        };
    }

    return { isValid: true, message: "" };
};

// Name validation (minimum 5 characters)
export const validateName = (name) => {
    if (!name) {
        return { isValid: false, message: "Please enter your full name" };
    }

    if (name.length < 5) {
        return {
            isValid: false,
            message: "Full name must be at least 5 characters long",
        };
    }

    return { isValid: true, message: "" };
};

// Address validation (minimum 5 characters)
export const validateAddress = (address) => {
    if (!address) {
        return { isValid: false, message: "Please enter an address" };
    }

    if (address.length < 5) {
        return {
            isValid: false,
            message: "Address must be at least 5 characters long",
        };
    }

    return { isValid: true, message: "" };
};

// Business name validation (minimum 5 characters)
export const validateBusinessName = (businessName) => {
    if (!businessName) {
        return { isValid: false, message: "Please enter the business name" };
    }

    if (businessName.length < 5) {
        return {
            isValid: false,
            message: "Business name must be at least 5 characters long",
        };
    }

    return { isValid: true, message: "" };
};

// Business address validation (minimum 5 characters)
export const validateBusinessAddress = (businessAddress) => {
    if (!businessAddress) {
        return {
            isValid: false,
            message: "Please enter the business address",
        };
    }

    if (businessAddress.length < 5) {
        return {
            isValid: false,
            message: "Business address must be at least 5 characters long",
        };
    }

    return { isValid: true, message: "" };
};

// Product name validation (10-20 characters)
export const validateProductName = (name) => {
    if (!name) {
        return { isValid: false, message: "Please enter the product name" };
    }

    if (name.length < 10 || name.length > 20) {
        return {
            isValid: false,
            message: "Product name must be 10-20 characters long",
        };
    }

    return { isValid: true, message: "" };
};

// Price validation (must be a positive number)
export const validatePrice = (price) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
        return { isValid: false, message: "Price must be a valid number" };
    }

    if (numPrice <= 0) {
        return { isValid: false, message: "Price must be a positive number" };
    }

    return { isValid: true, message: "" };
};

// Description validation (maximum 500 characters)
export const validateDescription = (description) => {
    if (!description) {
        return { isValid: false, message: "Please enter a description" };
    }

    if (description.length > 500) {
        return {
            isValid: false,
            message: "Description must not exceed 500 characters",
        };
    }

    return { isValid: true, message: "" };
};

// Profile picture validation (avatar image)
export const validateProfilePicture = (file) => {
    if (!file) {
        return { isValid: false, message: "Please select a profile picture" };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: "Image must be a valid format (JPEG, PNG, GIF)",
        };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: "Image must be smaller than 5MB",
        };
    }

    return { isValid: true, message: "" };
};

// Product image validation
export const validateProductImage = (file) => {
    if (!file) {
        return { isValid: false, message: "Please select a product image" };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: "Product image must be a valid format (JPEG, PNG, GIF)",
        };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: "Product image must be smaller than 5MB",
        };
    }

    return { isValid: true, message: "" };
};

// Distribution hub validation - now dynamic based on server data
export const validateDistributionHub = (hub, availableHubs = []) => {
    if (!hub) {
        return { isValid: false, message: "Please select a distribution hub" };
    }

    if (availableHubs.length > 0) {
        const hubExists = availableHubs.some(
            (h) => h._id === hub || h.name === hub
        );
        if (!hubExists) {
            return {
                isValid: false,
                message: "Please select a valid distribution hub",
            };
        }
    }

    return { isValid: true, message: "" };
};