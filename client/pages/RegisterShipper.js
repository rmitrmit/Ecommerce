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
import { validateUsername, validatePassword } from "../utils/validation";
import { postJson } from "../utils/api";
import { useHubs } from "../hooks/useHubs";
import apiCacheManager from "../utils/apiCache";

const RegisterShipper = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const { hubs, loading: hubsLoading, error: hubsError } = useHubs();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        name: "",
        idCard: "",
        dateOfBirth: "",
        address: "",
        assignedHub: "",
        vehicleType: "",
        licensePlate: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        name: "",
        idCard: "",
        dateOfBirth: "",
        address: "",
        assignedHub: "",
        vehicleType: "",
        licensePlate: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
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
        // Validation cho assignedHub
        let assignedHubError = "";
        if (!formData.assignedHub) {
            assignedHubError = "Please select a distribution hub";
        } else {
            const hubExists = hubs.some(
                (hub) => hub._id === formData.assignedHub
            );
            if (!hubExists) {
                assignedHubError = "Please select a valid distribution hub";
            }
        }

        let confirmPasswordError = "";
        if (formData.password !== formData.confirmPassword) {
            confirmPasswordError = "Passwords do not match";
        }

        // Validation cho các trường bắt buộc
        const errors = {
            username: usernameValidation.isValid
                ? ""
                : usernameValidation.message,
            password: passwordValidation.isValid
                ? ""
                : passwordValidation.message,
            confirmPassword: confirmPasswordError,
            email: formData.email ? "" : "Email is required",
            name: formData.name ? "" : "Full name is required",
            idCard: formData.idCard ? "" : "ID card number is required",
            dateOfBirth: formData.dateOfBirth ? "" : "Date of birth is required",
            address: formData.address ? "" : "Address is required",
            assignedHub: assignedHubError,
            vehicleType: formData.vehicleType
                ? ""
                : "Vehicle type is required",
            licensePlate: formData.licensePlate ? "" : "License plate is required",
            emergencyContactName: formData.emergencyContactName
                ? ""
                : "Emergency contact name is required",
            emergencyContactPhone: formData.emergencyContactPhone
                ? ""
                : "Emergency contact phone number is required",
            emergencyContactRelationship: formData.emergencyContactRelationship
                ? ""
                : "Relationship is required",
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
                email: formData.email,
                name: formData.name,
                idCard: formData.idCard,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
                assignedHub: formData.assignedHub,
                vehicleInfo: {
                    type: formData.vehicleType,
                    licensePlate: formData.licensePlate,
                },
                emergencyContact: {
                    name: formData.emergencyContactName,
                    phone: formData.emergencyContactPhone,
                    relationship: formData.emergencyContactRelationship,
                },
            };
            const res = await postJson("/api/auth/register/shipper", payload);
            const user = res.user || res;
            dispatch(registerSuccess(user));
            apiCacheManager.clearCacheForEndpoint("/api/auth/profile");

            navigate("/shipper/dashboard");
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
                                        Shipper Registration
                                    </h3>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Thông tin cơ bản */}
                                    <h4>Basic information</h4>

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
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.email && (
                                            <span className="text-danger">
                                                {validationErrors.email}
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

                                    

                                    {/* Personal info */}
                                    <h4 style={{ marginTop: "20px" }}>
                                        Personal information
                                    </h4>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="idCard"
                                            placeholder="ID number"
                                            value={formData.idCard}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.idCard && (
                                            <span className="text-danger">
                                                {validationErrors.idCard}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of birth</label>
                                        <input
                                            className="input"
                                            type="date"
                                            name="dateOfBirth"
                                            placeholder="Date of bith"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.dateOfBirth && (
                                            <span className="text-danger">
                                                {validationErrors.dateOfBirth}
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

                                    {/* Vehicle info */}
                                    <h4 style={{ marginTop: "20px" }}>
                                        Behicle information
                                    </h4>

                                    <div className="form-group">
                                        <select
                                            className="input"
                                            name="vehicleType"
                                            value={formData.vehicleType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">
                                                Vehicle type
                                            </option>
                                            <option value="motorcycle">
                                                Motorcycle
                                            </option>
                                            <option value="bicycle">
                                                Bicycle
                                            </option>
                                            <option value="car">Car</option>
                                            <option value="truck">
                                                Truck
                                            </option>
                                        </select>
                                        {validationErrors.vehicleType && (
                                            <span className="text-danger">
                                                {validationErrors.vehicleType}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="licensePlate"
                                            placeholder="License plate"
                                            value={formData.licensePlate}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.licensePlate && (
                                            <span className="text-danger">
                                                {validationErrors.licensePlate}
                                            </span>
                                        )}
                                    </div>

                                    {/* Emergency contact */}
                                    <h4 style={{ marginTop: "20px" }}>
                                        Emergency contact
                                    </h4>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="text"
                                            name="emergencyContactName"
                                            placeholder="Name"
                                            value={
                                                formData.emergencyContactName
                                            }
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.emergencyContactName && (
                                            <span className="text-danger">
                                                {
                                                    validationErrors.emergencyContactName
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            className="input"
                                            type="tel"
                                            name="emergencyContactPhone"
                                            placeholder="Phone"
                                            value={
                                                formData.emergencyContactPhone
                                            }
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.emergencyContactPhone && (
                                            <span className="text-danger">
                                                {
                                                    validationErrors.emergencyContactPhone
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <select
                                            className="input"
                                            name="emergencyContactRelationship"
                                            value={
                                                formData.emergencyContactRelationship
                                            }
                                            onChange={handleInputChange}
                                        >
                                            <option value="">
                                                Relationship
                                            </option>
                                            <option value="parent">
                                                Parent
                                            </option>
                                            <option value="spouse">
                                                Spouse
                                            </option>
                                            <option value="sibling">
                                                Sibling
                                            </option>
                                            <option value="friend">
                                                Friend
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                        {validationErrors.emergencyContactRelationship && (
                                            <span className="text-danger">
                                                {
                                                    validationErrors.emergencyContactRelationship
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* Distribution hub */}
                                    <h4 style={{ marginTop: "20px" }}>
                                        Distribution hub
                                    </h4>

                                    <div className="form-group">
                                        <select
                                            className="input"
                                            name="assignedHub"
                                            value={formData.assignedHub}
                                            onChange={handleInputChange}
                                            disabled={hubsLoading}
                                        >
                                            <option value="">
                                                {hubsLoading
                                                    ? "Loading..."
                                                    : "Select distribution hub"}
                                            </option>
                                            {hubs.map((hub) => (
                                                <option
                                                    key={hub._id}
                                                    value={hub._id}
                                                >
                                                    {hub.name}
                                                </option>
                                            ))}
                                        </select>
                                        {hubsError && (
                                            <span className="text-danger">
                                                {hubsError}
                                            </span>
                                        )}
                                        {validationErrors.assignedHub && (
                                            <span className="text-danger">
                                                {validationErrors.assignedHub}
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

export default RegisterShipper;
