/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../store/slices/authSlice";
import { useToastContext } from "../contexts/ToastContext";
import { putJson } from "../utils/api";
import VendorLayout from "../layouts/VendorLayout";

const VendorProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToastContext();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        businessName: "",
        businessAddress: "",
        businessLicense: "",
        taxCode: "",
        businessType: "individual",
        businessDescription: "",
        website: "",
        contactPerson: {
            name: "",
            position: "",
            phone: "",
        },
        bankAccount: {
            bankName: "",
            accountNumber: "",
            accountHolder: "",
        },
        socialMedia: {
            facebook: "",
            instagram: "",
            tiktok: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (
            !isAuthenticated ||
            (user?.role !== "vendor" && user?.role !== "Vendor")
        ) {
            navigate("/login");
            return;
        }

        // Load existing vendor data
        if (user) {
            setFormData({
                businessName: user.businessName || "",
                businessAddress: user.businessAddress || "",
                businessLicense: user.businessLicense || "",
                taxCode: user.taxCode || "",
                businessType: user.businessType || "individual",
                businessDescription: user.businessDescription || "",
                website: user.website || "",
                contactPerson: {
                    name: user.contactPerson?.name || "",
                    position: user.contactPerson?.position || "",
                    phone: user.contactPerson?.phone || "",
                },
                bankAccount: {
                    bankName: user.bankAccount?.bankName || "",
                    accountNumber: user.bankAccount?.accountNumber || "",
                    accountHolder: user.bankAccount?.accountHolder || "",
                },
                socialMedia: {
                    facebook: user.socialMedia?.facebook || "",
                    instagram: user.socialMedia?.instagram || "",
                    tiktok: user.socialMedia?.tiktok || "",
                },
            });
        }
    }, [user, isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear validation error
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleNestedInputChange = (e) => {
        const { name, value } = e.target;
        const [parent, child] = name.split(".");

        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: value,
            },
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.businessName.trim()) {
            errors.businessName = "Business name is required";
        }

        if (!formData.businessAddress.trim()) {
            errors.businessAddress = "Business address is required";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await putJson(
                "/api/auth/vendor/profile",
                formData
            );

            dispatch(updateProfile(response.user));
            toast.success("Information updated successfully!");
        } catch (error) {
            toast.error(
                error.message || "Error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <VendorLayout>
            <div
                className="container"
                style={{ paddingTop: "24px", paddingBottom: "24px" }}
            >
                {/* Page Header */}
                <div className="row" style={{ marginBottom: "24px" }}>
                    <div className="col-md-12">
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            Set up Shop
                        </h2>
                        <p
                            style={{
                                margin: "8px 0 0 0",
                                fontSize: "14px",
                                color: "#666",
                            }}
                        >
                            Update business information
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Form Header */}
                            <div
                                style={{
                                    backgroundColor: "#fafafa",
                                    padding: "16px 24px",
                                    borderBottom: "1px solid #e0e0e0",
                                }}
                            >
                                <h4
                                    style={{
                                        margin: 0,
                                        fontSize: "18px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Shop information
                                </h4>
                                <p
                                    style={{
                                        margin: "4px 0 0 0",
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    Update detailed information about your business
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                style={{ padding: "24px" }}
                            >
                                {/* Basic info */}
                                <div style={{ marginBottom: "32px" }}>
                                    <h5
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            marginBottom: "16px",
                                            color: "#333",
                                            borderBottom: "2px solid #ee4d2d",
                                            paddingBottom: "8px",
                                        }}
                                    >
                                        Basic information
                                    </h5>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    htmlFor="businessName"
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Business name *
                                                </label>
                                                <input
                                                    id="businessName"
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.3s",
                                                    }}
                                                    type="text"
                                                    name="businessName"
                                                    value={
                                                        formData.businessName
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="Enter business name"
                                                    onFocus={(e) =>
                                                        (e.target.style.borderColor =
                                                            "#ee4d2d")
                                                    }
                                                    onBlur={(e) =>
                                                        (e.target.style.borderColor =
                                                            "#d9d9d9")
                                                    }
                                                />
                                                {validationErrors.businessName && (
                                                    <span
                                                        style={{
                                                            color: "#ff4d4f",
                                                            fontSize: "12px",
                                                            marginTop: "4px",
                                                            display: "block",
                                                        }}
                                                    >
                                                        {
                                                            validationErrors.businessName
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Business type
                                                </label>
                                                <select
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    name="businessType"
                                                    value={
                                                        formData.businessType
                                                    }
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="individual">
                                                        Individual
                                                    </option>
                                                    <option value="company">
                                                        Company
                                                    </option>
                                                    <option value="cooperative">
                                                        Cooperative
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                marginBottom: "6px",
                                                color: "#333",
                                            }}
                                        >
                                            Business address *
                                        </label>
                                        <textarea
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                minHeight: "80px",
                                                resize: "vertical",
                                            }}
                                            name="businessAddress"
                                            value={formData.businessAddress}
                                            onChange={handleInputChange}
                                            placeholder="Enter address"
                                            rows={3}
                                        />
                                        {validationErrors.businessAddress && (
                                            <span
                                                style={{
                                                    color: "#ff4d4f",
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                    display: "block",
                                                }}
                                            >
                                                {
                                                    validationErrors.businessAddress
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                marginBottom: "6px",
                                                color: "#333",
                                            }}
                                        >
                                            Business description
                                        </label>
                                        <textarea
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                minHeight: "100px",
                                                resize: "vertical",
                                            }}
                                            name="businessDescription"
                                            value={formData.businessDescription}
                                            onChange={handleInputChange}
                                            placeholder="Enter description"
                                            rows={4}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                marginBottom: "6px",
                                                color: "#333",
                                            }}
                                        >
                                            Website
                                        </label>
                                        <input
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                            }}
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                {/* Legal information */}
                                <div style={{ marginBottom: "32px" }}>
                                    <h5
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            marginBottom: "16px",
                                            color: "#333",
                                            borderBottom: "2px solid #ee4d2d",
                                            paddingBottom: "8px",
                                        }}
                                    >
                                        Legal information
                                    </h5>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Business license
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="businessLicense"
                                                    value={
                                                        formData.businessLicense
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="Enter business license number"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Tax code
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="taxCode"
                                                    value={formData.taxCode}
                                                    onChange={handleInputChange}
                                                    placeholder="Tax code"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* contact */}
                                <div style={{ marginBottom: "32px" }}>
                                    <h5
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            marginBottom: "16px",
                                            color: "#333",
                                            borderBottom: "2px solid #ee4d2d",
                                            paddingBottom: "8px",
                                        }}
                                    >
                                        Contact information
                                    </h5>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Name
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="contactPerson.name"
                                                    value={
                                                        formData.contactPerson
                                                            .name
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Position
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="contactPerson.position"
                                                    value={
                                                        formData.contactPerson
                                                            .position
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="Position"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Phone
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="tel"
                                                    name="contactPerson.phone"
                                                    value={
                                                        formData.contactPerson
                                                            .phone
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="Phone"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank information */}
                                <div style={{ marginBottom: "32px" }}>
                                    <h5
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            marginBottom: "16px",
                                            color: "#333",
                                            borderBottom: "2px solid #ee4d2d",
                                            paddingBottom: "8px",
                                        }}
                                    >
                                        Bank information
                                    </h5>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Bank name
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="bankAccount.bankName"
                                                    value={
                                                        formData.bankAccount
                                                            .bankName
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="Bank name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Bank account number
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="bankAccount.accountNumber"
                                                    value={
                                                        formData.bankAccount
                                                            .accountNumber
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="Bank account number"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Account holder
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="text"
                                                    name="bankAccount.accountHolder"
                                                    value={
                                                        formData.bankAccount
                                                            .accountHolder
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="Account holder"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social media */}
                                <div style={{ marginBottom: "32px" }}>
                                    <h5
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            marginBottom: "16px",
                                            color: "#333",
                                            borderBottom: "2px solid #ee4d2d",
                                            paddingBottom: "8px",
                                        }}
                                    >
                                        Social media
                                    </h5>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Facebook
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="url"
                                                    name="socialMedia.facebook"
                                                    value={
                                                        formData.socialMedia
                                                            .facebook
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="https://facebook.com/yourpage"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Instagram
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="url"
                                                    name="socialMedia.instagram"
                                                    value={
                                                        formData.socialMedia
                                                            .instagram
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="https://instagram.com/yourpage"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div
                                                style={{ marginBottom: "16px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#333",
                                                    }}
                                                >
                                                    TikTok
                                                </label>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        border: "1px solid #d9d9d9",
                                                        borderRadius: "6px",
                                                        fontSize: "14px",
                                                    }}
                                                    type="url"
                                                    name="socialMedia.tiktok"
                                                    value={
                                                        formData.socialMedia
                                                            .tiktok
                                                    }
                                                    onChange={
                                                        handleNestedInputChange
                                                    }
                                                    placeholder="https://tiktok.com/@yourpage"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div
                                    style={{
                                        textAlign: "center",
                                        paddingTop: "24px",
                                        borderTop: "1px solid #e0e0e0",
                                    }}
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            backgroundColor: loading
                                                ? "#ccc"
                                                : "#ee4d2d",
                                            color: "white",
                                            border: "none",
                                            padding: "12px 32px",
                                            borderRadius: "6px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: loading
                                                ? "not-allowed"
                                                : "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            if (!loading) {
                                                e.target.style.backgroundColor =
                                                    "#d73502";
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!loading) {
                                                e.target.style.backgroundColor =
                                                    "#ee4d2d";
                                            }
                                        }}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
};

export default VendorProfile;
