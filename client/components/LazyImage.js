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

const LazyImage = ({
    src,
    alt,
    style,
    placeholder = null,
    onLoad = null,
    onError = null,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        setHasError(true);
        if (onError) onError();
    };

    return (
        <div ref={imgRef} style={style} {...props}>
            {isInView && (
                <>
                    {!isLoaded && !hasError && (
                        <div
                            style={{
                                ...style,
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "14px",
                            }}
                        >
                            {placeholder || "Đang tải..."}
                        </div>
                    )}
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            ...style,
                            display: isLoaded ? "block" : "none",
                        }}
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                    {hasError && (
                        <div
                            style={{
                                ...style,
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "14px",
                                flexDirection: "column",
                            }}
                        >
                            <div>📷</div>
                            <div>Can't load img</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    style: PropTypes.object,
    placeholder: PropTypes.string,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
};

export default LazyImage;
