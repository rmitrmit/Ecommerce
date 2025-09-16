/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            // UI fallback
            return (
                <div
                    style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        margin: "20px 0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <div
                        style={{
                            fontSize: "48px",
                            color: "#ff6b35",
                            marginBottom: "20px",
                        }}
                    >
                        ⚠️
                    </div>
                    <h3
                        style={{
                            color: "#333",
                            marginBottom: "15px",
                            fontSize: "20px",
                        }}
                    >
                        Error
                    </h3>
                    <p
                        style={{
                            color: "#666",
                            marginBottom: "20px",
                            fontSize: "14px",
                        }}
                    >
                        There seems to be an error. Please try again later.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({
                                hasError: false,
                                error: null,
                                errorInfo: null,
                            });
                            window.location.reload();
                        }}
                        style={{
                            backgroundColor: "#ff6b35",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}
                    >
                        Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Show API error 
export const ApiErrorDisplay = ({ error, onRetry, retryCount = 0 }) => {
    if (!error) return null;

    return (
        <div
            style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#fff5f5",
                border: "1px solid #fed7d7",
                borderRadius: 8,
                margin: "20px 0",
            }}
        >
            <div
                style={{
                    fontSize: "24px",
                    color: "#e53e3e",
                    marginBottom: "10px",
                }}
            >
                ⚠️
            </div>
            <h4
                style={{
                    color: "#c53030",
                    marginBottom: "10px",
                    fontSize: "16px",
                }}
            >
                Can't load data
            </h4>
            <p
                style={{
                    color: "#9c4221",
                    marginBottom: "15px",
                    fontSize: "14px",
                }}
            >
                {error}
            </p>
            {onRetry && retryCount < 3 && (
                <button
                    onClick={onRetry}
                    style={{
                        backgroundColor: "#e53e3e",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Retry ({retryCount}/3)
                </button>
            )}
        </div>
    );
};

export default ErrorBoundary;
