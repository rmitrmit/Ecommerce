/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../api/cartApi";
import { logout } from "./authSlice";

// Async thunks
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart();
            return response.data;
        } catch (error) {
            // Nếu lỗi là "Chưa đăng nhập", return empty cart thay vì reject
            if (error.response?.data?.error === "Chưa đăng nhập") {
                return {
                    items: [],
                    totalItems: 0,
                    totalAmount: 0,
                    isEmpty: true,
                };
            }
            return rejectWithValue(
                error.response?.data?.error || error.message
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const response = await cartApi.addItem(productId, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message
            );
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await cartApi.updateItem(productId, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await cartApi.removeItem(productId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message
            );
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.clearCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message
            );
        }
    }
);

// Initial state
const initialState = {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    isEmpty: true,
    loading: false,
    adding: false,
    updating: false,
    removing: false,
    clearing: false,
    error: null,
    lastUpdated: null,
    hasInitialized: false, // Track if cart has been fetched at least once
};

// Cart slice
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Optimistic updates for better UX
        optimisticAddItem: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === product.id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    productId: product.id,
                    quantity,
                    price: product.price,
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        images: product.images || [],
                        stock: product.stock,
                        status: product.status,
                    },
                });
            }

            // Recalculate totals safely
            state.totalItems = state.items.reduce(
                (total, item) => total + (item.quantity || 0),
                0
            );
            state.totalAmount = state.items.reduce(
                (total, item) =>
                    total + (item.price || 0) * (item.quantity || 0),
                0
            );
            state.isEmpty = state.items.length === 0;
        },

        optimisticUpdateItem: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(
                (item) => item.productId === productId
            );

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(
                        (item) => item.productId !== productId
                    );
                } else {
                    item.quantity = quantity;
                }

                // Recalculate totals safely
                state.totalItems = state.items.reduce(
                    (total, item) => total + (item.quantity || 0),
                    0
                );
                state.totalAmount = state.items.reduce(
                    (total, item) =>
                        total + (item.price || 0) * (item.quantity || 0),
                    0
                );
                state.isEmpty = state.items.length === 0;
            }
        },

        optimisticRemoveItem: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(
                (item) => item.productId !== productId
            );

            // Recalculate totals safely
            state.totalItems = state.items.reduce(
                (total, item) => total + (item.quantity || 0),
                0
            );
            state.totalAmount = state.items.reduce(
                (total, item) =>
                    total + (item.price || 0) * (item.quantity || 0),
                0
            );
            state.isEmpty = state.items.length === 0;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear cart (synchronous)
        clear: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
            state.isEmpty = true;
            state.lastUpdated = new Date().toISOString();
            state.error = null;
        },

        // Reset cart
        resetCart: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.hasInitialized = true; // Mark as initialized
                const payload = action.payload || {};

                // Check if payload has nested structure
                const cartData = payload.cart || payload;

                state.items = cartData.items || [];
                state.totalItems = cartData.totalItems || 0;
                state.totalAmount = cartData.totalAmount || 0;
                state.isEmpty =
                    cartData.isEmpty !== undefined
                        ? cartData.isEmpty
                        : state.items.length === 0;
                state.lastUpdated =
                    cartData.lastUpdated || new Date().toISOString();
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to cart - No loading state for smooth UX
            .addCase(addToCart.pending, (state) => {
                state.adding = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.adding = false;
                const payload = action.payload || {};
                state.items = payload.items || [];
                state.totalItems = payload.totalItems || 0;
                state.totalAmount = payload.totalAmount || 0;
                state.isEmpty = payload.isEmpty || false;
                state.lastUpdated =
                    payload.lastUpdated || new Date().toISOString();
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.adding = false;
                state.error = action.payload;
            })

            // Update cart item - No loading state for smooth UX
            .addCase(updateCartItem.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.updating = false;
                const payload = action.payload || {};
                state.items = payload.items || [];
                state.totalItems = payload.totalItems || 0;
                state.totalAmount = payload.totalAmount || 0;
                state.isEmpty = payload.isEmpty || false;
                state.lastUpdated =
                    payload.lastUpdated || new Date().toISOString();
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })

            // Remove from cart - No loading state for smooth UX
            .addCase(removeFromCart.pending, (state) => {
                state.removing = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.removing = false;
                const payload = action.payload || {};
                state.items = payload.items || [];
                state.totalItems = payload.totalItems || 0;
                state.totalAmount = payload.totalAmount || 0;
                state.isEmpty = payload.isEmpty || false;
                state.lastUpdated =
                    payload.lastUpdated || new Date().toISOString();
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.removing = false;
                state.error = action.payload;
            })

            // Clear cart - No loading state for smooth UX
            .addCase(clearCart.pending, (state) => {
                state.clearing = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.clearing = false;
                const payload = action.payload || {};
                state.items = payload.items || [];
                state.totalItems = payload.totalItems || 0;
                state.totalAmount = payload.totalAmount || 0;
                state.isEmpty = payload.isEmpty || false;
                state.lastUpdated =
                    payload.lastUpdated || new Date().toISOString();
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.clearing = false;
                state.error = action.payload;
            })
            // Reset cart when user logs out
            .addCase(logout, (state) => {
                return initialState;
            });
    },
});

export const {
    optimisticAddItem,
    optimisticUpdateItem,
    optimisticRemoveItem,
    clear,
    clearError,
    resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
