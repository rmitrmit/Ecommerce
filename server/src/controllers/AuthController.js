/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { BaseUser, DistributionHub } from "../models/index.js";
import { authService } from "../services/index.js";

export const registerCustomer = async (req, res) => {
    try {
        const { username, password, email, name, address, phone } = req.body;

        const customer = await authService.createCustomer({
            username,
            password,
            email,
            name,
            address,
            phone,
            profilePicture: req.file ? req.file.filename : null,
        });

        const sessionData = authService.createSessionData(customer);

        req.session.user = sessionData;

        res.status(201).json({
            message: "Đăng ký khách hàng thành công",
            user: {
                id: customer._id,
                username: customer.username,
                email: customer.email,
                role: customer.role,
                name: customer.name,
                address: customer.address,
                phone: customer.phone,
                profilePicture: customer.profilePicture,
                isActive: customer.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Lỗi server nội bộ",
        });
    }
};

export const registerVendor = async (req, res) => {
    try {
        const { username, password, email, businessName, businessAddress } =
            req.body;

        const vendor = await authService.createVendor({
            username,
            password,
            email,
            businessName,
            businessAddress,
            profilePicture: req.file ? req.file.filename : null,
        });

        const sessionData = authService.createSessionData(vendor);

        req.session.user = sessionData;

        res.status(201).json({
            message: "Đăng ký nhà bán thành công",
            user: {
                id: vendor._id,
                username: vendor.username,
                email: vendor.email,
                role: vendor.role,
                businessName: vendor.businessName,
                businessAddress: vendor.businessAddress,
                profilePicture: vendor.profilePicture,
                isActive: vendor.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Lỗi server nội bộ",
        });
    }
};

// Đăng ký người giao hàng
export const registerShipper = async (req, res) => {
    try {
        const {
            username,
            password,
            email,
            name,
            idCard,
            dateOfBirth,
            address,
            assignedHub,
            vehicleInfo,
            emergencyContact,
        } = req.body;

        const shipper = await authService.createShipper({
            username,
            password,
            email,
            name,
            idCard,
            dateOfBirth,
            address,
            assignedHub,
            vehicleInfo,
            emergencyContact,
            profilePicture: req.file ? req.file.filename : null,
        });

        const sessionData = authService.createSessionData(shipper);

        req.session.user = sessionData;

        res.status(201).json({
            message: "Đăng ký shipper thành công",
            user: {
                id: shipper._id,
                username: shipper.username,
                email: shipper.email,
                role: shipper.role,
                name: shipper.name,
                assignedHub: shipper.assignedHub,
                profilePicture: shipper.profilePicture,
                isActive: shipper.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Lỗi server nội bộ",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await authService.login(username, password);

        const sessionData = authService.createSessionData(user);

        req.session.user = sessionData;

        // Đảm bảo session được lưu
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({
                    error: "Lỗi lưu session",
                });
            }

            res.json({
                message: "Đăng nhập thành công",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name || user.businessName,
                    address: user.address || user.businessAddress,
                    profilePicture: user.profilePicture,
                    isActive: user.isActive,
                },
            });
        });
    } catch (error) {
        res.status(401).json({
            error: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
        });
    }
};

export const updateVendorProfile = async (req, res) => {
    try {
        const vendorId = req.session.user?.userId;
        if (!vendorId) {
            return res.status(401).json({
                error: "Chưa đăng nhập",
            });
        }

        const updateData = req.body;

        const updatedVendor = await authService.updateVendorProfile(
            vendorId,
            updateData
        );

        res.status(200).json({
            message: "Cập nhật thông tin thành công",
            user: {
                id: updatedVendor._id,
                username: updatedVendor.username,
                email: updatedVendor.email,
                role: updatedVendor.role,
                businessName: updatedVendor.businessName,
                businessAddress: updatedVendor.businessAddress,
                businessLicense: updatedVendor.businessLicense,
                taxCode: updatedVendor.taxCode,
                businessType: updatedVendor.businessType,
                businessDescription: updatedVendor.businessDescription,
                website: updatedVendor.website,
                contactPerson: updatedVendor.contactPerson,
                bankAccount: updatedVendor.bankAccount,
                socialMedia: updatedVendor.socialMedia,
                profilePicture: updatedVendor.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Lỗi server nội bộ",
        });
    }
};

export const logout = async (req, res) => {
    try {
        const success = await authService.logout(req);

        if (success) {
            res.json({
                message: "Đăng xuất thành công",
            });
        } else {
            res.status(500).json({
                error: "Lỗi đăng xuất",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
    try {
        // Lấy thông tin từ session
        const sessionUser = req.session.user;

        if (!sessionUser) {
            return res.status(401).json({
                error: "Chưa đăng nhập",
            });
        }

        // Lấy thông tin chi tiết từ database
        const user = await BaseUser.findById(sessionUser.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                error: "Không tìm thấy thông tin người dùng",
            });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                name: user.name,
                address: user.address,
                businessName: user.businessName,
                businessAddress: user.businessAddress,
                assignedHub: user.assignedHub,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Cập nhật ảnh đại diện
export const updateProfilePicture = async (req, res) => {
    try {
        const user = await BaseUser.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                error: "Không tìm thấy thông tin người dùng",
            });
        }

        // Cập nhật ảnh đại diện
        user.profilePicture = req.file
            ? req.file.filename
            : user.profilePicture;
        await user.save();

        res.json({
            message: "Cập nhật ảnh đại diện thành công",
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};
