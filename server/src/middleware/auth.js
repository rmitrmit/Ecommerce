/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { BaseUser } from "../models/index.js";

// Session authentication middleware
export const auth = async (req, res, next) => {
    try {
        // Check if a session exists
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                error: "Not logged in",
            });
        }

        const sessionUser = req.session.user;

        // Check if the user exists and is active
        const user = await BaseUser.findById(sessionUser.userId).select(
            "-password"
        );

        if (!user) {
            // Destroy the session if the user does not exist
            req.session.destroy();
            return res.status(401).json({
                error: "Account does not exist",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: "Account has been disabled",
            });
        }

        // Save user information to the request object
        req.user = {
            userId: user._id,
            username: user.username,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
        });
    }
};

// Middleware to check for a specific role
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Access denied",
            });
        }

        // Check role (case insensitive)
        const userRole = req.user.role.toLowerCase();

        if (Array.isArray(roles)) {
            const normalizedRoles = roles.map((role) => role.toLowerCase());
            if (!normalizedRoles.includes(userRole)) {
                return res.status(403).json({
                    error: "Access denied - Insufficient role",
                });
            }
        } else if (userRole !== roles.toLowerCase()) {
            return res.status(403).json({
                error: "Access denied - Insufficient role",
            });
        }

        next();
    };
};

// Middleware to check for vendor role
export const requireVendor = requireRole("vendor");

// Middleware to check for customer role
export const requireCustomer = requireRole("customer");

// Middleware to check for shipper role
export const requireShipper = requireRole("shipper");