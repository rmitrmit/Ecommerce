/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import apiCacheManager from "./apiCache";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

async function extractErrorMessage(res) {
    const text = await res.text().catch(() => "");
    try {
        const data = JSON.parse(text);
        return (
            data.error ||
            data.message ||
            text ||
            `Request failed: ${res.status}`
        );
    } catch {
        return text || `Request failed: ${res.status}`;
    }
}

export async function getJson(path, useCache = true) {
    const endpoint = `${API_BASE}${path}`;

    // Check cache first
    if (useCache) {
        const cachedData = apiCacheManager.getCachedData(endpoint);
        if (cachedData) {
            return cachedData;
        }

        // Check if there is a pending request
        if (apiCacheManager.hasPendingRequest(endpoint)) {
            return apiCacheManager.getPendingRequest(endpoint);
        }
    }

    // Create a new request
    const requestPromise = (async () => {
        try {
            const res = await fetch(endpoint, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const errorMessage = await extractErrorMessage(res);
                throw new Error(errorMessage);
            }

            const data = await res.json();

            // Save to cache if successful
            if (useCache) {
                apiCacheManager.setCachedData(endpoint, data);
            }

            return data;
        } catch (error) {
            // Clear cache if an error occurs so it can retry later
            if (useCache) {
                apiCacheManager.clearCacheForEndpoint(endpoint);
            }
            throw error;
        }
    })();

    // Add to pending requests if using cache
    if (useCache) {
        apiCacheManager.addPendingRequest(endpoint, requestPromise);
    }

    return requestPromise;
}

export async function postJson(path, body) {
    const endpoint = `${API_BASE}${path}`;

    // Check if body is FormData (file upload)
    const isFormData = body instanceof FormData;

    const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: isFormData
            ? {} // Let browser set multipart/form-data headers automatically
            : { "Content-Type": "application/json" },
        body: isFormData ? body : JSON.stringify(body),
    });

    if (!res.ok) {
        const errorMessage = await extractErrorMessage(res);
        throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
}


export async function putJson(path, body) {
    const endpoint = `${API_BASE}${path}`;

    const res = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorMessage = await extractErrorMessage(res);
        throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
}

export async function deleteJson(path) {
    const endpoint = `${API_BASE}${path}`;

    const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const errorMessage = await extractErrorMessage(res);
        throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
}

export { API_BASE };
