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
    registerStart,
    registerSuccess,
    registerFailure,
    clearError,
} from "../store/slices/authSlice";
import {
    validateUsername,
    validatePassword,
    validateBusinessName,
    validateBusinessAddress,
} from "../utils/validation";
import { postJson } from "../utils/api";
import apiCacheManager from "../utils/apiCache";

const RegisterVendor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        businessAddress: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        businessAddress: "",
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
        const businessNameValidation = validateBusinessName(
            formData.businessName
        );
        const businessAddressValidation = validateBusinessAddress(
            formData.businessAddress
        );

        let confirmPasswordError = "";
        if (formData.password !== formData.confirmPassword) {
            confirmPasswordError = "Passwords do not match";
        }

        const errors = {
            username: usernameValidation.isValid
                ? ""
                : usernameValidation.message,
            password: passwordValidation.isValid
                ? ""
                : passwordValidation.message,
            confirmPassword: confirmPasswordError,
            businessName: businessNameValidation.isValid
                ? ""
                : businessNameValidation.message,
            businessAddress: businessAddressValidation.isValid
                ? ""
                : businessAddressValidation.message,
        };

        setValidationErrors(errors);

        return Object.values(errors).every((error) => error === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch(registerStart());

        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                email: `${formData.username}@example.com`,
                businessName: formData.businessName,
                businessAddress: formData.businessAddress,
            };
            const res = await postJson("/api/auth/register/vendor", payload);
            const user = res.user || res;
            dispatch(registerSuccess(user));
            apiCacheManager.clearCacheForEndpoint("/api/auth/profile");
            navigate("/vendor/dashboard");
        } catch (err) {
            dispatch(
                registerFailure(
                    err.message || "Registration failed. Please try again."
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
                                <div className="section-title">
                                    <h3 className="title">
                                    Vendor Registration
                                    </h3>
                                    <p
                                        style={{
                                            color: "#666",
                                            fontSize: "14px",
                                            marginTop: "8px",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        Just basic information to get started. You can update in more detail after logging in.
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
                                        <input
                                            className="input"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.confirmPassword && (
                                            <span className="text-danger">
                                                {
                                                    validationErrors.confirmPassword
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="profilePicture">Profile Picture</label>
                                        <input
                                            id="profilePicture"
                                            className="input"
                                            type="file"
                                            name="profilePicture"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="businessName"
                                            placeholder="Business name"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.businessName && (
                                            <span className="text-danger">
                                                {validationErrors.businessName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="businessAddress"
                                            placeholder="Business address"
                                            value={formData.businessAddress}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.businessAddress && (
                                            <span className="text-danger">
                                                {
                                                    validationErrors.businessAddress
                                                }
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
                                                ? "Registering..."
                                                : "Register"}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center">
                                    <p>
                                        Already have an account?{" "}
                                        <Link to="/login" style={{ color: "blue" }}>Login</Link>
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

export default RegisterVendor;
