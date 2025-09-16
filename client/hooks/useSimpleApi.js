/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { useState, useEffect, useCallback } from "react";
import { getJson } from "../utils/api";

// Hook đơn giản để gọi API mà không có các tính năng phức tạp
export const useSimpleApi = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getJson(endpoint, true); // Enable cache

            setData(result);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

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

// Hook đơn giản cho products
export const useSimpleProducts = () => {
    const { data, loading, error, refetch } = useSimpleApi("/api/products");

    return {
        data: data?.products || [], // Extract products array from response
        loading,
        error,
        refetch,
    };
};

// Hook đơn giản cho categories
export const useSimpleCategories = () => {
    return useSimpleApi("/api/products/categories");
};
