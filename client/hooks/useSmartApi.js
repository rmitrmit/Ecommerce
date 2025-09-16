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

// Hook thông minh để quản lý API với caching
export const useSmartApi = (endpoint, options = {}) => {
    const {
        dependencies = [],
        retryAttempts = 3,
        retryDelay = 1000,
        enableCache = true,
        enableRetry = true,
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef(null);

    const fetchDataDirectly = async () => {
        if (!isMountedRef.current) return;

        // Hủy request trước đó nếu có
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            setError(null);

            // Kiểm tra cache trước
            if (enableCache) {
                const cachedData = apiCacheManager.getCachedData(endpoint);
                if (cachedData) {
                    setData(cachedData);
                    setLoading(false);
                    return;
                }
            }

            // Thêm delay để tránh spam requests
            await new Promise((resolve) => setTimeout(resolve, 200));

            if (!isMountedRef.current) return;

            const result = await getJson(endpoint, enableCache);

            if (!isMountedRef.current) return;

            setData(result);
            setRetryCount(0);
        } catch (err) {
            if (!isMountedRef.current) return;

            if (err.name === "AbortError") {
                return; // Request bị hủy, không cần xử lý
            }

            setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");

            // Auto retry nếu được bật
            if (enableRetry && retryCount < retryAttempts) {
                const delay = retryDelay * Math.pow(2, retryCount); // Exponential backoff
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setRetryCount((prev) => prev + 1);
                        fetchDataDirectly();
                    }
                }, delay);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const fetchData = useCallback(fetchDataDirectly, [
        endpoint,
        enableCache,
        enableRetry,
        retryAttempts,
        retryDelay,
    ]);

    const retry = useCallback(() => {
        if (retryCount < retryAttempts && isMountedRef.current) {
            setRetryCount((prev) => prev + 1);
            fetchData();
        }
    }, [retryCount, retryAttempts, fetchData]);

    const refetch = useCallback(() => {
        if (isMountedRef.current) {
            // Clear cache để force refresh
            if (enableCache) {
                apiCacheManager.clearCacheForEndpoint(endpoint);
            }
            setRetryCount(0);
            fetchData();
        }
    }, [endpoint, enableCache, fetchData]);

    useEffect(() => {
        fetchData();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    // Cleanup khi dependencies thay đổi
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [dependencies]);

    return {
        data,
        loading,
        error,
        retry,
        retryCount,
        refetch,
        isRetrying: retryCount > 0,
    };
};

// Hook đặc biệt cho products
export const useSmartProducts = () => {
    return useSmartApi("/api/products", {
        cacheDuration: 10 * 60 * 1000, // 10 phút cho products
        retryAttempts: 2,
    });
};

// Hook đặc biệt cho categories
export const useSmartCategories = () => {
    return useSmartApi("/api/products/categories", {
        cacheDuration: 15 * 60 * 1000, // 15 phút cho categories
        retryAttempts: 2,
    });
};

// Hook đặc biệt cho auth profile
export const useSmartAuthProfile = () => {
    return useSmartApi("/api/auth/profile", {
        cacheDuration: 2 * 60 * 1000, // 2 phút cho auth profile
        retryAttempts: 1,
    });
};
