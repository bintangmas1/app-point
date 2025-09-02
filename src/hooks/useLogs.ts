// hooks/useLogs.js
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export function useLogs(filters = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            setError(null);

            try {
                // Query dengan relasi (JOIN)
                let query = supabase.from("logs").select(`
                    id, note, created_at, admin_id, customer_id,
                    admins:admin_id (id, name),
                    customers:customer_id (id, name)
                    `);

                // Terapkan filter
                if (filters.customerId) {
                    query = query.eq("customer_id", filters.customerId);
                }

                if (filters.adminId) {
                    query = query.eq("admin_id", filters.adminId);
                }

                // Ordering
                query = query.order(filters.orderBy || "created_at", {
                    ascending: filters.ascending ?? false,
                });

                // Limit
                if (filters.limit) {
                    query = query.limit(filters.limit);
                }

                const { data, error } = await query;

                if (error) throw error;
                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLogs();
    }, [JSON.stringify(filters)]);

    return { data, loading, error };
}
