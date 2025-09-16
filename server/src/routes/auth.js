/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import express from "express";
import { upload } from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";
import {
    registerCommonValidation,
    vendorValidation,
    customerValidation,
    shipperValidation,
    loginValidation,
    checkValidationErrors,
} from "../middleware/validation.js";
import {
    registerCustomer,
    registerVendor,
    registerShipper,
    login,
    logout,
    getCurrentUser,
    updateProfilePicture,
    updateVendorProfile,
} from "../controllers/AuthController.js";

const router = express.Router();

// Đăng ký khách hàng
router.post(
    "/register/customer",
    upload.single("profilePicture"),
    registerCommonValidation,
    customerValidation,
    checkValidationErrors,
    registerCustomer
);

// Đăng ký nhà bán
router.post(
    "/register/vendor",
    upload.single("profilePicture"),
    registerCommonValidation,
    vendorValidation,
    checkValidationErrors,
    registerVendor
);

// Đăng ký shipper
router.post(
    "/register/shipper",
    upload.single("profilePicture"),
    registerCommonValidation,
    shipperValidation,
    checkValidationErrors,
    registerShipper
);

// Đăng nhập
router.post("/login", loginValidation, checkValidationErrors, login);

// Đăng xuất
router.post("/logout", logout);

// Lấy thông tin user hiện tại
router.get("/profile", auth, getCurrentUser);

// Cập nhật profile picture
router.put(
    "/profile/picture",
    auth,
    upload.single("profilePicture"),
    updateProfilePicture
);

// Cập nhật thông tin vendor
router.put("/vendor/profile", auth, updateVendorProfile);

export default router;
