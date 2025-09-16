/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

// API Cache Manager to avoid duplicate requests
class ApiCacheManager {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
        this.requestTimestamps = new Map();
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 mins cache
    }

    // Get data from cache
    getCachedData(endpoint) {
        const cached = this.cache.get(endpoint);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    // Save data into cache
    setCachedData(endpoint, data) {
        this.cache.set(endpoint, {
            data,
            timestamp: Date.now(),
        });
    }

    // Check if there is a pending request
    hasPendingRequest(endpoint) {
        return this.pendingRequests.has(endpoint);
    }

    // Add request to pending
    addPendingRequest(endpoint, promise) {
        this.pendingRequests.set(endpoint, promise);

        // Cleanup after the request completes
        promise.finally(() => {
            this.pendingRequests.delete(endpoint);
        });

        return promise;
    }

    // Get a pending request
    getPendingRequest(endpoint) {
        return this.pendingRequests.get(endpoint);
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        this.pendingRequests.clear();
        if (this.requestTimestamps) {
            this.requestTimestamps.clear();
        }
    }

    // Clear cache for a specific endpoint
    clearCacheForEndpoint(endpoint) {
        this.cache.delete(endpoint);
        this.pendingRequests.delete(endpoint);
        if (this.requestTimestamps) {
            this.requestTimestamps.delete(endpoint);
        }
    }
}

// Singleton instance
const apiCacheManager = new ApiCacheManager();

export default apiCacheManager;
