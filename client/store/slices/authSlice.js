/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { createSlice } from "@reduxjs/toolkit";

// Restore state from localStorage
const getInitialState = () => {
    try {
        const savedAuth = localStorage.getItem("auth");
        if (savedAuth) {
            const parsedAuth = JSON.parse(savedAuth);
            return {
                user: parsedAuth.user || null,
                isAuthenticated: !!parsedAuth.user,
                loading: false,
                error: null,
            };
        }
    } catch (error) {
        localStorage.removeItem("auth");
    }

    return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    };
};

const initialState = getInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;

            // Save to localStorage
            try {
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        user: action.payload,
                        isAuthenticated: true,
                    })
                );
            } catch (error) {
                console.error("Error saving auth state to localStorage:", error);
            }
            
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        registerStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;

            // Save to localStorage
            try {
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        user: action.payload,
                        isAuthenticated: true,
                    })
                );
            } catch (error) {
                console.error("Error saving auth state to localStorage:", error);
            }
            
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;

            // Remove from localStorage
            try {
                localStorage.removeItem("auth");
            } catch (error) {
                console.error("Error removing auth state from localStorage:", error);
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        updateProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    logoutStart,
    logout,
    clearError,
    updateProfile,
} = authSlice.actions;

export default authSlice.reducer;
