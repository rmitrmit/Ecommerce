/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { useState, useEffect, useCallback, useRef } from "react";

// Hook để debounce giá trị
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Hook để throttle function calls
export const useThrottle = (callback, delay) => {
    const lastRun = useRef(Date.now());

    return useCallback(
        (...args) => {
            if (Date.now() - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = Date.now();
            }
        },
        [callback, delay]
    );
};

// Hook để tối ưu hóa scroll events
export const useScrollOptimized = (callback, delay = 100) => {
    const throttledCallback = useThrottle(callback, delay);

    useEffect(() => {
        window.addEventListener("scroll", throttledCallback, { passive: true });
        return () => window.removeEventListener("scroll", throttledCallback);
    }, [throttledCallback]);
};

// Hook để tối ưu hóa resize events
export const useResizeOptimized = (callback, delay = 100) => {
    const throttledCallback = useThrottle(callback, delay);

    useEffect(() => {
        window.addEventListener("resize", throttledCallback, { passive: true });
        return () => window.removeEventListener("resize", throttledCallback);
    }, [throttledCallback]);
};

// Hook để kiểm tra element có trong viewport không
export const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting && !hasIntersected) {
                    setHasIntersected(true);
                }
            },
            {
                threshold: 0.1,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [options, hasIntersected]);

    return [ref, isIntersecting, hasIntersected];
};

// Hook để tối ưu hóa API calls với caching
export const useApiCache = () => {
    const cache = useRef(new Map());
    const [loading, setLoading] = useState(false);

    const getCachedData = useCallback((key) => {
        const cached = cache.current.get(key);
        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
            // 5 minutes cache
            return cached.data;
        }
        return null;
    }, []);

    const setCachedData = useCallback((key, data) => {
        cache.current.set(key, {
            data,
            timestamp: Date.now(),
        });
    }, []);

    const clearCache = useCallback(() => {
        cache.current.clear();
    }, []);

    return {
        getCachedData,
        setCachedData,
        clearCache,
        loading,
        setLoading,
    };
};
