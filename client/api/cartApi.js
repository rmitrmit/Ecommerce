/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { getJson, postJson, putJson, deleteJson } from "../utils/api";

class CartApi {
    async getCart() {
        return await getJson("/api/cart");
    }

    async addItem(productId, quantity = 1) {
        console.log("CartApi.addItem →", { productId, quantity }); // Debug log
        return await postJson("/api/cart/items", { productId, quantity });
    }
    

    async updateItem(productId, quantity) {
        return await putJson(`/api/cart/items/${productId}`, { quantity });
    }

    async removeItem(productId) {
        return await deleteJson(`/api/cart/items/${productId}`);
    }

    async clearCart() {
        return await deleteJson("/api/cart");
    }
}

export const cartApi = new CartApi();
