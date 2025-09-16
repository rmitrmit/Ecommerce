/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Toast Item Component
const ToastItem = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Auto remove after duration
        if (toast.duration > 0) {
            const timer = setTimeout(() => {
                handleRemove();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleRemove = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300); // Match animation duration
    };

    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return "fa-check-circle";
            case "error":
                return "fa-exclamation-circle";
            case "warning":
                return "fa-exclamation-triangle";
            case "info":
                return "fa-info-circle";
            default:
                return "fa-bell";
        }
    };

    const getColors = () => {
        switch (toast.type) {
            case "success":
                return {
                    bg: "#10b981",
                    border: "#059669",
                    icon: "#ffffff",
                    text: "#ffffff",
                };
            case "error":
                return {
                    bg: "#ef4444",
                    border: "#dc2626",
                    icon: "#ffffff",
                    text: "#ffffff",
                };
            case "warning":
                return {
                    bg: "#f59e0b",
                    border: "#d97706",
                    icon: "#ffffff",
                    text: "#ffffff",
                };
            case "info":
                return {
                    bg: "#3b82f6",
                    border: "#2563eb",
                    icon: "#ffffff",
                    text: "#ffffff",
                };
            default:
                return {
                    bg: "#6b7280",
                    border: "#4b5563",
                    icon: "#ffffff",
                    text: "#ffffff",
                };
        }
    };

    const colors = getColors();

    return (
        <div
            style={{
                transform:
                    isVisible && !isLeaving
                        ? "translateX(0)"
                        : "translateX(100%)",
                opacity: isVisible && !isLeaving ? 1 : 0,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                minWidth: "320px",
                maxWidth: "400px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Icon */}
            <div
                style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <i
                    className={`fa ${getIcon()}`}
                    style={{
                        fontSize: "18px",
                        color: colors.icon,
                    }}
                />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                    <div
                        style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: colors.text,
                            marginBottom: toast.message ? "4px" : "0",
                        }}
                    >
                        {toast.title}
                    </div>
                )}
                {toast.message && (
                    <div
                        style={{
                            fontSize: "14px",
                            color: colors.text,
                            lineHeight: "1.4",
                            opacity: 0.9,
                        }}
                    >
                        {toast.message}
                    </div>
                )}
            </div>

            {/* Close Button */}
            <button
                onClick={handleRemove}
                style={{
                    flexShrink: 0,
                    background: "none",
                    border: "none",
                    color: colors.text,
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    opacity: 0.7,
                    transition: "opacity 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                }}
                onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                    e.target.style.opacity = "0.7";
                }}
            >
                <i className="fa fa-times" style={{ fontSize: "12px" }} />
            </button>

            {/* Progress Bar */}
            {toast.duration > 0 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "0 0 12px 12px",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "0 0 12px 12px",
                            animation: `progressBar ${toast.duration}ms linear forwards`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

ToastItem.propTypes = {
    toast: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["success", "error", "warning", "info"])
            .isRequired,
        title: PropTypes.string,
        message: PropTypes.string.isRequired,
        duration: PropTypes.number,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                pointerEvents: "none",
            }}
        >
            {toasts.map((toast) => (
                <div key={toast.id} style={{ pointerEvents: "auto" }}>
                    <ToastItem toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
};

ToastContainer.propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRemove: PropTypes.func.isRequired,
};

// Toast Hook
let toastId = 0;
const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = `toast-${++toastId}`;
        const newToast = {
            id,
            duration: 5000, // Default 5 seconds
            ...toast,
        };

        setToasts((prev) => [...prev, newToast]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message, title = "Thành công") => {
        addToast({ type: "success", title, message });
    };

    const error = (message, title = "Lỗi") => {
        addToast({ type: "error", title, message });
    };

    const warning = (message, title = "Cảnh báo") => {
        addToast({ type: "warning", title, message });
    };

    const info = (message, title = "Thông tin") => {
        addToast({ type: "info", title, message });
    };

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};

// CSS Animation
const ToastStyles = () => (
    <style jsx>{`
        @keyframes progressBar {
            from {
                width: 100%;
            }
            to {
                width: 0%;
            }
        }
    `}</style>
);

export { ToastContainer, useToast, ToastStyles };
export default ToastContainer;
