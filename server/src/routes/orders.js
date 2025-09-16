/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import express from "express";
import { auth, requireCustomer, requireShipper } from "../middleware/auth.js";
import {
    orderValidation,
    checkValidationErrors,
} from "../middleware/validation.js";
import {
    createOrder,
    getCustomerOrders,
    getShipperOrders,
    updateOrderStatus,
    getAllOrders,
} from "../controllers/OrderController.js";

const router = express.Router();

router.post(
    "/",
    auth,
    requireCustomer,
    orderValidation,
    checkValidationErrors,
    createOrder
);

router.get("/customer/orders", auth, requireCustomer, getCustomerOrders);

router.get("/shipper/orders", auth, requireShipper, getShipperOrders);

router.put("/:id/status", auth, requireShipper, updateOrderStatus);

router.get("/", auth, getAllOrders);

export default router;
