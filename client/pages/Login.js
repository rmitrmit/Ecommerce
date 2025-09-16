/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    loginStart,
    loginSuccess,
    loginFailure,
    clearError,
} from "../store/slices/authSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { validateUsername, validatePassword } from "../utils/validation";
import { postJson } from "../utils/api";
import apiCacheManager from "../utils/apiCache";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        if (error) {
            dispatch(clearError());
        }
    };

    const validateForm = () => {
        const usernameValidation = validateUsername(formData.username);
        const passwordValidation = validatePassword(formData.password);

        setValidationErrors({
            username: usernameValidation.isValid
                ? ""
                : usernameValidation.message,
            password: passwordValidation.isValid
                ? ""
                : passwordValidation.message,
        });

        return usernameValidation.isValid && passwordValidation.isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch(loginStart());

        try {
            const res = await postJson("/api/auth/login", {
                username: formData.username,
                password: formData.password,
            });
            const user = res.user || res;
            dispatch(loginSuccess(user));

            apiCacheManager.clearCacheForEndpoint("/api/auth/profile");

            dispatch(fetchCart());
            if (user.role === "Vendor") {
                navigate("/vendor/dashboard");
            } else if (user.role === "Shipper") {
                navigate("/shipper/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            dispatch(
                loginFailure(
                    err.message || "Login failed. Please try again."
                )
            );
        }
    };

    return (
        <div>
            <div className="section" style={{ paddingTop: 30 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            <div
                                className="billing-details"
                                style={{
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                    borderRadius: 6,
                                    padding: 24,
                                }}
                            >
                                <div
                                    className="section-title"
                                    style={{ marginBottom: 16 }}
                                >
                                    <h3 className="title">Login</h3>
                                    <p style={{ color: "#777", marginTop: 6 }}>
                                        Welcome back
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.username && (
                                            <span className="text-danger">
                                                {validationErrors.username}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.password && (
                                            <span className="text-danger">
                                                {validationErrors.password}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <button
                                            type="submit"
                                            className="primary-btn"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Logging in..."
                                                : "Login"}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center">
                                    <p>
                                        Don’t have an account?
                                        <Link to="/register/customer" style={{ color: "blue" }}>
                                            {" "}
                                            Register as Customer
                                        </Link>{" "}
                                        |
                                        <Link to="/register/vendor" style={{ color: "blue" }}>
                                            {" "}
                                            Register as Vendor
                                        </Link>{" "}
                                        |
                                        <Link to="/register/shipper" style={{ color: "blue" }}>
                                            {" "}
                                            Register as Shipper
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
