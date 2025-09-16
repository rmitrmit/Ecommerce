/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const CustomDropdown = ({
    options = [],
    value = "",
    onChange,
    placeholder = "Choose",
    className = "",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus search input when click dropdown
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);

    // Filter options by search term
    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Select label of the chosen option
    const selectedLabel = value
        ? options.find((opt) => opt === value)
        : placeholder;

    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSearchTerm("");
            }
        }
    };

    return (
        <div
            ref={dropdownRef}
            className={`custom-dropdown ${className} ${
                disabled ? "disabled" : ""
            }`}
            style={{
                position: "relative",
                width: "100%",
                zIndex: 1000,
            }}
        >
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                style={{
                    width: "100%",
                    height: "50px",
                    padding: "0 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px 0 0 8px",
                    backgroundColor: "#fff",
                    color: "#333",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    outline: "none",
                    opacity: disabled ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                    if (!disabled) {
                        e.target.style.borderColor = "#ff6b35";
                        e.target.style.boxShadow =
                            "0 0 0 3px rgba(255, 107, 53, 0.1)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!disabled) {
                        e.target.style.borderColor = "#e1e5e9";
                        e.target.style.boxShadow = "none";
                    }
                }}
            >
                <span
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        textAlign: "left",
                    }}
                >
                    {selectedLabel}
                </span>
                <i
                    className={`fa ${
                        isOpen ? "fa-chevron-up" : "fa-chevron-down"
                    }`}
                    style={{
                        fontSize: "12px",
                        color: "#666",
                        transition: "transform 0.3s ease",
                        marginLeft: "8px",
                        flexShrink: 0,
                    }}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        border: "2px solid #e1e5e9",
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                        maxHeight: "300px",
                        overflow: "hidden",
                        animation: "dropdownSlideDown 0.3s ease-out",
                        zIndex: 1001,
                    }}
                >
                    {/* Search Input */}
                    <div
                        style={{
                            padding: "12px",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: "#f8f9fa",
                        }}
                    >
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #e1e5e9",
                                borderRadius: "6px",
                                fontSize: "14px",
                                outline: "none",
                                transition: "border-color 0.3s ease",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#ff6b35";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e1e5e9";
                            }}
                        />
                    </div>

                    {/* Options List */}
                    <div
                        style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        {/* All Categories Option */}
                        <div
                            onClick={() => handleOptionClick("")}
                            style={{
                                padding: "12px 16px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#333",
                                borderBottom: "1px solid #f0f0f0",
                                transition: "all 0.2s ease",
                                backgroundColor:
                                    value === "" ? "#fff5f0" : "transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (value !== "") {
                                    e.target.style.backgroundColor = "#fff5f0";
                                    e.target.style.color = "#ff6b35";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== "") {
                                    e.target.style.backgroundColor =
                                        "transparent";
                                    e.target.style.color = "#333";
                                }
                            }}
                        >
                            <i
                                className="fa fa-th-large"
                                style={{
                                    marginRight: "8px",
                                    color: "#ff6b35",
                                    fontSize: "12px",
                                }}
                            />
                            All categories
                        </div>

                        {/* Category Options */}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={option}
                                    onClick={() => handleOptionClick(option)}
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#333",
                                        borderBottom:
                                            index < filteredOptions.length - 1
                                                ? "1px solid #f0f0f0"
                                                : "none",
                                        transition: "all 0.2s ease",
                                        backgroundColor:
                                            value === option
                                                ? "#fff5f0"
                                                : "transparent",
                                        fontWeight:
                                            value === option ? "600" : "400",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (value !== option) {
                                            e.target.style.backgroundColor =
                                                "#fff5f0";
                                            e.target.style.color = "#ff6b35";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (value !== option) {
                                            e.target.style.backgroundColor =
                                                "transparent";
                                            e.target.style.color = "#333";
                                        }
                                    }}
                                >
                                    <i
                                        className="fa fa-tag"
                                        style={{
                                            marginRight: "8px",
                                            color: "#ff6b35",
                                            fontSize: "12px",
                                        }}
                                    />
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    padding: "20px 16px",
                                    textAlign: "center",
                                    color: "#999",
                                    fontSize: "14px",
                                }}
                            >
                                <i
                                    className="fa fa-search"
                                    style={{ marginRight: "8px" }}
                                />
                                Cannot find
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes dropdownSlideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

CustomDropdown.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default CustomDropdown;
