/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    filteredProducts: [],
    loading: false,
    error: null,
    filters: {
        searchTerm: "",
        minPrice: null,
        maxPrice: null,
    },
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        fetchProductsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
            state.filteredProducts = action.payload;
            state.error = null;
        },
        fetchProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addProductStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        addProductSuccess: (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
            state.filteredProducts.push(action.payload);
            state.error = null;
        },
        addProductFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProductStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateProductSuccess: (state, action) => {
            state.loading = false;
            const index = state.products.findIndex(
                (p) => p.id === action.payload.id
            );
            if (index !== -1) {
                state.products[index] = action.payload;
                state.filteredProducts[index] = action.payload;
            }
            state.error = null;
        },
        updateProductFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteProductStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteProductSuccess: (state, action) => {
            state.loading = false;
            state.products = state.products.filter(
                (p) => p.id !== action.payload
            );
            state.filteredProducts = state.filteredProducts.filter(
                (p) => p.id !== action.payload
            );
            state.error = null;
        },
        deleteProductFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            // Apply filters
            let filtered = state.products;

            if (state.filters.searchTerm) {
                filtered = filtered.filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(state.filters.searchTerm.toLowerCase())
                );
            }

            if (state.filters.minPrice !== null) {
                filtered = filtered.filter(
                    (product) => product.price >= state.filters.minPrice
                );
            }

            if (state.filters.maxPrice !== null) {
                filtered = filtered.filter(
                    (product) => product.price <= state.filters.maxPrice
                );
            }

            state.filteredProducts = filtered;
        },
        clearFilters: (state) => {
            state.filters = {
                searchTerm: "",
                minPrice: null,
                maxPrice: null,
            };
            state.filteredProducts = state.products;
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    addProductStart,
    addProductSuccess,
    addProductFailure,
    updateProductStart,
    updateProductSuccess,
    updateProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
    setFilters,
    clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
