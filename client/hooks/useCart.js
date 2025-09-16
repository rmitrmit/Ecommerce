/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    optimisticAddItem,
    optimisticUpdateItem,
    optimisticRemoveItem,
    clearError,
} from "../store/slices/cartSlice";
import { toast } from "react-toastify";

export const useCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const addItem = useCallback(
        async (product, quantity = 1) => {
            if (!isAuthenticated) {
                toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
                return;
            }

            try {
                // Optimistic update
                dispatch(optimisticAddItem({ product, quantity }));

                // Server update
                await dispatch(
                    addToCart({
                        productId: product.id,
                        quantity,
                    })
                ).unwrap();

                toast.success("Đã thêm sản phẩm vào giỏ hàng");
            } catch (error) {
                // Revert optimistic update on error
                dispatch(fetchCart());
                toast.error(error || "Lỗi khi thêm sản phẩm");
            }
        },
        [dispatch, isAuthenticated]
    );

    const updateItem = useCallback(
        async (productId, quantity) => {
            if (!isAuthenticated) {
                toast.error("Vui lòng đăng nhập để cập nhật giỏ hàng");
                return;
            }

            try {
                // Optimistic update
                dispatch(optimisticUpdateItem({ productId, quantity }));

                // Server update
                await dispatch(
                    updateCartItem({ productId, quantity })
                ).unwrap();
            } catch (error) {
                // Revert optimistic update on error
                dispatch(fetchCart());
                toast.error(error || "Lỗi khi cập nhật giỏ hàng");
            }
        },
        [dispatch, isAuthenticated]
    );

    const removeItem = useCallback(
        async (productId) => {
            if (!isAuthenticated) {
                toast.error("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng");
                return;
            }

            try {
                // Optimistic update
                dispatch(optimisticRemoveItem(productId));

                // Server update
                await dispatch(removeFromCart(productId)).unwrap();

                toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
            } catch (error) {
                // Revert optimistic update on error
                dispatch(fetchCart());
                toast.error(error || "Lỗi khi xóa sản phẩm");
            }
        },
        [dispatch, isAuthenticated]
    );

    const clear = useCallback(async () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để xóa giỏ hàng");
            return;
        }

        try {
            await dispatch(clearCart()).unwrap();
            toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
        } catch (error) {
            toast.error(error || "Lỗi khi xóa giỏ hàng");
        }
    }, [dispatch, isAuthenticated]);

    const refresh = useCallback(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        ...cart,
        addItem,
        updateItem,
        removeItem,
        clear,
        refresh,
        dismissError,
    };
};
