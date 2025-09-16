/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React from "react";

// Skeleton cho Product Card
export const ProductCardSkeleton = () => (
    <div
        style={{
            background: "#fff",
            borderRadius: 8,
            padding: 15,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: 20,
        }}
    >
        {/* Image skeleton */}
        <div
            style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                marginBottom: 15,
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />

        {/* Title skeleton */}
        <div
            style={{
                height: "20px",
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                marginBottom: 10,
                width: "80%",
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />

        {/* Price skeleton */}
        <div
            style={{
                height: "18px",
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                marginBottom: 10,
                width: "60%",
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />

        {/* Rating skeleton */}
        <div
            style={{
                height: "16px",
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                width: "40%",
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />
    </div>
);

// Skeleton cho Category
export const CategorySkeleton = () => (
    <div
        style={{
            textAlign: "center",
            marginBottom: 15,
        }}
    >
        <div
            style={{
                height: "40px",
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                margin: "10px",
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />
    </div>
);

// Skeleton cho Banner
export const BannerSkeleton = () => (
    <div
        style={{
            width: "100%",
            height: "300px",
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            animation: "pulse 1.5s ease-in-out infinite",
        }}
    />
);

// CSS Animation cho skeleton
const skeletonStyles = `
@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}
`;

// Inject CSS
if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = skeletonStyles;
    document.head.appendChild(style);
}

export default {
    ProductCardSkeleton,
    CategorySkeleton,
    BannerSkeleton,
};
