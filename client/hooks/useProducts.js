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

export const useProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchProducts = useCallback(
        async (pageNum = 1, reset = false) => {
            setLoading(true);
            setError(null);

            try {
                const queryParams = new URLSearchParams();

                // Add filters
                if (filters.category)
                    queryParams.append("category", filters.category);
                if (filters.search)
                    queryParams.append("search", filters.search);
                if (filters.minPrice)
                    queryParams.append("minPrice", filters.minPrice);
                if (filters.maxPrice)
                    queryParams.append("maxPrice", filters.maxPrice);

                // Add pagination
                queryParams.append("page", pageNum);
                queryParams.append("limit", 12);

                const queryString = queryParams.toString();
                const url = queryString
                    ? `/api/products?${queryString}`
                    : "/api/products";

                const data = await getJson(url);
                const items = (data.products || data || []).map((p) => ({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    category: p.category,
                    mainImage: p.mainImage,
                    images: p.images,
                    vendorId: p.vendor,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                }));

                if (reset) {
                    setProducts(items);
                    setPage(1);
                } else {
                    setProducts((prev) =>
                        pageNum === 1 ? items : [...prev, ...items]
                    );
                }

                setTotal(data.total || items.length);
                setHasMore(items.length === 12); // Assuming 12 items per page
                setPage(pageNum);
            } catch (err) {
                setError(err.message || "Lỗi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        },
        [filters]
    );

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchProducts(page + 1, false);
        }
    }, [loading, hasMore, page, fetchProducts]);

    const refresh = useCallback(() => {
        fetchProducts(1, true);
    }, [fetchProducts]);

    useEffect(() => {
        fetchProducts(1, true);
    }, [filters.category, filters.search, filters.minPrice, filters.maxPrice]);

    return {
        products,
        loading,
        error,
        hasMore,
        total,
        loadMore,
        refresh,
    };
};
