/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import express from "express";
import { auth } from "../middleware/auth.js";
import {
    getHubs,
    createHub,
    updateHub,
    deleteHub,
} from "../controllers/HubController.js";

const router = express.Router();

// Lấy tất cả distribution hubs (public)
router.get("/", getHubs);

// Tạo hub mới (cần auth - cho admin)
router.post("/", auth, createHub);

// Cập nhật hub (cần auth - cho admin)
router.put("/:id", auth, updateHub);

// Xóa hub (cần auth - cho admin)
router.delete("/:id", auth, deleteHub);

export default router;
