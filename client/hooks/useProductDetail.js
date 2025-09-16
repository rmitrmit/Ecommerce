/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { useState, useEffect } from "react";
import { getJson, API_BASE } from "../utils/api";

export const useProductDetail = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            setError("Product ID is required");
            return;
        }

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getJson(`/api/products/${productId}`);
                const p = data.product || data;
                const mapped = {
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    category: p.category,
                    vendorId: p.vendor,
                    stock: p.stock,
                    status: p.status,
                    images:
                        Array.isArray(p.images) && p.images.length
                            ? p.images.map((img) => `${API_BASE}/${img}`)
                            : [
                                  `${API_BASE}/uploads/products/default-product.png`,
                              ],
                };
                setProduct(mapped);
            } catch (e) {
                setError("Không thể tải thông tin sản phẩm");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
};
