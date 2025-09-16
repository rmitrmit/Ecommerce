/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getJson } from "../utils/api";
import apiCacheManager from "../utils/apiCache";

export const useApi = (apiCall, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const isMountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            setError(null);

            await new Promise((resolve) => setTimeout(resolve, 100));

            if (!isMountedRef.current) return;

            const result = await apiCall();

            if (!isMountedRef.current) return;

            setData(result);
            setRetryCount(0); // Reset retry count on success
        } catch (err) {
            if (!isMountedRef.current) return;

            setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, dependencies);

    const retry = useCallback(() => {
        if (retryCount < 3 && isMountedRef.current) {
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            setTimeout(() => {
                if (isMountedRef.current) {
                    setRetryCount((prev) => prev + 1);
                    fetchData();
                }
            }, delay);
        }
    }, [retryCount, fetchData]);

    useEffect(() => {
        fetchData();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        retry,
        retryCount,
        refetch: fetchData,
    };
};

// Hook for products with caching
export const useProducts = () => {
    return useApi(() => getJson("/api/products"), []);
};

// Hook for categories with caching
export const useCategories = () => {
    return useApi(() => getJson("/api/products/categories"), []);
};

// Hook with timeout and retry logic
export const useApiWithTimeout = (
    apiCall,
    timeout = 10000,
    dependencies = []
) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            setLoading(true);
            setError(null);

            // Wrap API call with timeout
            const result = await Promise.race([
                apiCall(),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Request timeout")),
                        timeout
                    )
                ),
            ]);

            setData(result);
        } catch (err) {
            if (err.name === "AbortError") {
                setError("Request timeout - Vui lòng thử lại");
            } else {
                setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
            }
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};
