/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { useState, useEffect } from "react";
import { getJson } from "../utils/api";

export const useHubs = () => {
    const [hubs, setHubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHubs = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getJson("/api/hubs");
                setHubs(data.hubs || []);
            } catch (err) {
                setError(
                    err.message || "Lỗi tải danh sách trung tâm phân phối"
                );
                setHubs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHubs();
    }, []);

    return { hubs, loading, error };
};
