/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import {
    USER_ROLES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
} from "../constants/index.js";
import { customerService, vendorService, shipperService } from "./index.js";
import { BaseUser } from "../models/index.js";

class AuthService {
    // Tạo JWT token
    generateToken(payload) {
        return jwt.sign(payload, env.jwt.secret, {
            expiresIn: env.jwt.expire,
        });
    }

    // Xác thực JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, env.jwt.secret);
        } catch (error) {
            throw new Error(ERROR_MESSAGES.TOKEN_INVALID);
        }
    }

    // Mã hóa mật khẩu
    async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    // So sánh mật khẩu
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Xác thực độ mạnh mật khẩu
    validatePassword(password) {
        const minLength = 8;
        const maxLength = 20;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (password.length < minLength) {
            throw new Error("Mật khẩu phải có ít nhất 8 ký tự");
        }

        if (password.length > maxLength) {
            throw new Error("Mật khẩu không được vượt quá 20 ký tự");
        }

        if (!hasUpperCase) {
            throw new Error("Mật khẩu phải có ít nhất 1 chữ hoa");
        }

        if (!hasLowerCase) {
            throw new Error("Mật khẩu phải có ít nhất 1 chữ thường");
        }

        if (!hasNumbers) {
            throw new Error("Mật khẩu phải có ít nhất 1 số");
        }

        if (!hasSpecialChar) {
            throw new Error(
                "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)"
            );
        }

        return true;
    }

    // Tạo refresh token
    generateRefreshToken(payload) {
        return jwt.sign(payload, env.jwt.secret, {
            expiresIn: "30d",
        });
    }

    // Tạo dữ liệu user trong session
    createSessionData(user) {
        return {
            userId: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        };
    }

    // Xác thực vai trò người dùng
    validateRole(userRole, allowedRoles) {
        if (!allowedRoles.includes(userRole)) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN);
        }
        return true;
    }

    // Kiểm tra người dùng có hoạt động không
    checkUserActive(user) {
        if (!user.isActive) {
            throw new Error("Tài khoản đã bị vô hiệu hóa");
        }
        return true;
    }

    // Tạo khách hàng
    async createCustomer(userData) {
        return await customerService.createCustomer(userData);
    }

    // Tạo nhà bán hàng
    async createVendor(userData) {
        return await vendorService.createVendor(userData);
    }

    // Tạo người giao hàng
    async createShipper(userData) {
        return await shipperService.createShipper(userData);
    }

    // Cập nhật thông tin vendor
    async updateVendorProfile(vendorId, updateData) {
        return await vendorService.updateVendor(vendorId, updateData);
    }

    // Đăng nhập
    async login(username, password) {
        // Tìm người dùng theo tên đăng nhập
        const user = await BaseUser.findOne({ username });
        if (!user) {
            throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        // Kiểm tra mật khẩu
        const isValidPassword = await this.comparePassword(
            password,
            user.password
        );
        if (!isValidPassword) {
            throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        // Kiểm tra tài khoản có active không
        this.checkUserActive(user);

        // Cập nhật lần đăng nhập gần nhất
        user.lastLogin = new Date();
        await user.save();

        return user;
    }

    // Đăng xuất
    logout(req) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

export default new AuthService();
