/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postJson } from "../../utils/api";
import { clear } from "./cartSlice";

// Async thunks
export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async (orderData, { rejectWithValue, dispatch }) => {
        try {
            const response = await postJson("/api/orders", orderData);
            // Clear cart after successful order
            dispatch(clear());
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message
            );
        }
    }
);

const initialState = {
    orders: [],
    activeOrders: [],
    loading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        fetchOrdersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchOrdersSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
            state.error = null;
        },
        fetchOrdersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchActiveOrdersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchActiveOrdersSuccess: (state, action) => {
            state.loading = false;
            state.activeOrders = action.payload;
            state.error = null;
        },
        fetchActiveOrdersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createOrderStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        createOrderSuccess: (state, action) => {
            state.loading = false;
            state.orders.push(action.payload);
            state.error = null;
        },
        createOrderFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateOrderStatusStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateOrderStatusSuccess: (state, action) => {
            state.loading = false;
            const order = state.orders.find(
                (o) => o.id === action.payload.orderId
            );
            if (order) {
                order.status = action.payload.status;
                order.updatedAt = new Date().toISOString();
            }

            const activeOrder = state.activeOrders.find(
                (o) => o.id === action.payload.orderId
            );
            if (activeOrder) {
                activeOrder.status = action.payload.status;
                activeOrder.updatedAt = new Date().toISOString();

                // Remove from active orders if delivered or canceled
                if (
                    action.payload.status === "delivered" ||
                    action.payload.status === "canceled"
                ) {
                    state.activeOrders = state.activeOrders.filter(
                        (o) => o.id !== action.payload.orderId
                    );
                }
            }

            state.error = null;
        },
        updateOrderStatusFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        assignShipperStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        assignShipperSuccess: (state, action) => {
            state.loading = false;
            const order = state.orders.find(
                (o) => o.id === action.payload.orderId
            );
            if (order) {
                order.shipperId = action.payload.shipperId;
                order.shipperName = action.payload.shipperName;
                order.status = "active";
                order.updatedAt = new Date().toISOString();
            }

            const activeOrder = state.activeOrders.find(
                (o) => o.id === action.payload.orderId
            );
            if (activeOrder) {
                activeOrder.shipperId = action.payload.shipperId;
                activeOrder.shipperName = action.payload.shipperName;
                activeOrder.status = "active";
                activeOrder.updatedAt = new Date().toISOString();
            }

            state.error = null;
        },
        assignShipperFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload);
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    fetchOrdersStart,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    fetchActiveOrdersStart,
    fetchActiveOrdersSuccess,
    fetchActiveOrdersFailure,
    createOrderStart,
    createOrderSuccess,
    createOrderFailure,
    updateOrderStatusStart,
    updateOrderStatusSuccess,
    updateOrderStatusFailure,
    assignShipperStart,
    assignShipperSuccess,
    assignShipperFailure,
} = ordersSlice.actions;

export default ordersSlice.reducer;
