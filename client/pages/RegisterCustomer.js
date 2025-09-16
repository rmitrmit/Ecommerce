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
import { postJson } from "../utils/api";
import apiCacheManager from "../utils/apiCache";
import {
    registerStart,
    registerSuccess,
    registerFailure,
    clearError,
} from "../store/slices/authSlice";
import {
    validateUsername,
    validatePassword,
    validateName,
    validateAddress,
} from "../utils/validation";

const RegisterCustomer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        address: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        address: "",
    });

    const [profilePicture, setProfilePicture] = useState(null);

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

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
        const nameValidation = validateName(formData.name);
        const addressValidation = validateAddress(formData.address);

        let confirmPasswordError = "";
        if (formData.password !== formData.confirmPassword) {
            confirmPasswordError = "Passwords do not match";
        }

        setValidationErrors({
            username: usernameValidation.isValid
                ? ""
                : usernameValidation.message,
            password: passwordValidation.isValid
                ? ""
                : passwordValidation.message,
            confirmPassword: confirmPasswordError,
            name: nameValidation.isValid ? "" : nameValidation.message,
            address: addressValidation.isValid ? "" : addressValidation.message,
        });

        return (
            usernameValidation.isValid &&
            passwordValidation.isValid &&
            nameValidation.isValid &&
            addressValidation.isValid &&
            !confirmPasswordError
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        dispatch(registerStart());
    
        try {
            const formPayload = new FormData();
            formPayload.append("username", formData.username);
            formPayload.append("password", formData.password);
            formPayload.append("email", `${formData.username}@example.com`);
            formPayload.append("name", formData.name);
            formPayload.append("address", formData.address);
            if (profilePicture) {
                formPayload.append("profilePicture", profilePicture);
            }
    
            const res = await postJson("/api/auth/register/customer", formPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            const user = res.user || res;
            dispatch(registerSuccess(user));
            apiCacheManager.clearCacheForEndpoint("/api/auth/profile");
    
            navigate("/");
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
                                    Customer Registration
                                    </h3>
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
                                            placeholder="Confirm password"
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
                                        <input
                                            className="input"
                                            type="text"
                                            name="name"
                                            placeholder="Full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.name && (
                                            <span className="text-danger">
                                                {validationErrors.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="address"
                                            placeholder="Address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.address && (
                                            <span className="text-danger">
                                                {validationErrors.address}
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
                                            onChange={handleFileChange}
                                        />
                                        {validationErrors.profilePicture && (
                                            <span className="text-danger">
                                                {validationErrors.profilePicture}
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

export default RegisterCustomer;
