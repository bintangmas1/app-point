/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useWorkers.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase/client";

export interface Worker {
    id: string;
    name: string;
    username: string;
    password: string;
    is_super_admin: boolean;
    status: boolean;
    created_at: string;
}

export interface WorkersFilters {
    id?: string;
    status?: boolean;
    is_super_admin?: boolean;
    minPoint?: number;
    search?: string;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
}

export interface CreateWorkerData {
    name: string;
    username: string;
    password: string;
    status: boolean;
}

export interface UpdateWorkerData {
    name?: string;
    username?: string;
    password?: string;
    is_super_admin?: boolean;
    status?: boolean;
}

// 1. Fungsi untuk menambah worker baru (memanfaatkan UNIQUE constraint di database)
export async function addWorker(workerData: CreateWorkerData) {
    try {
        const completeWorkerData = {
            ...workerData,
            is_super_admin: false, // selalu false untuk pegawai baru
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from("admins")
            .insert([completeWorkerData])
            .select()
            .single();

        if (error) {
            // Handle duplicate username error
            if (error.code === '23505') { // PostgreSQL error code for unique violation
                throw new Error('Username sudah digunakan, silakan pilih username lain');
            }
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

// 2. Fungsi untuk update worker
export async function updateWorker(id: string, updates: UpdateWorkerData) {
    try {
        const { data, error } = await supabase
            .from("admins")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

// 3. Fungsi untuk update password worker
export async function updateWorkerPassword(id: string, newPassword: string) {
    try {
        const { data, error } = await supabase
            .from("admins")
            .update({ password: newPassword })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

// 4. Fungsi untuk delete worker
export async function deleteWorker(id: string) {
    try {
        const { error } = await supabase
            .from("admins")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

// 5. Hook untuk get workers
export function useWorkers(filters: WorkersFilters = {}) {
    const [data, setData] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        async function fetchWorkers() {
            setLoading(true);
            setError(null);
            try {
                let query = supabase
                    .from("admins")
                    .select("id, name, username, password, status, is_super_admin");

                // Terapkan filter berdasarkan parameter
                if (filters.id) {
                    query = query.eq("id", filters.id);
                }

                if (filters.status !== undefined) {
                    query = query.eq("status", filters.status);
                }

                if (filters.is_super_admin !== undefined) {
                    query = query.eq("is_super_admin", filters.is_super_admin);
                }

                if (filters.search) {
                    query = query.ilike("name", `%${filters.search}%`);
                }

                // Terapkan ordering (kecuali untuk detail)
                if (filters.id) {
                    // Jika mencari berdasarkan ID, tidak perlu ordering
                } else if (filters.orderBy) {
                    query = query.order(filters.orderBy, {
                        ascending: filters.ascending ?? false,
                    });
                } else {
                    query = query.order("created_at", { ascending: false });
                }

                // Terapkan limit (kecuali untuk detail)
                if (filters.id) {
                    // Jika mencari berdasarkan ID, tidak perlu limit
                } else if (filters.limit) {
                    query = query.limit(filters.limit);
                }

                const { data, error } = await query;

                if (error) throw error;
                setData(data || []);
            } catch (err: any) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchWorkers();
    }, [JSON.stringify(filters), refetchIndex]);

    const refetch = useCallback(() => {
        console.log("Refetch triggered"); // Debug log
        setRefetchIndex(prev => prev + 1);
    }, []);

    return { data, loading, error, refetch };
}

export function useWorkerDetail(WorkerId: string) {
    const [data, setData] = useState<Worker | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        async function fetchWorkerDetail() {
            if (!WorkerId) {
                setData(null);
                // setLoading(false);
                return;
            }

            // setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('admins')
                    .select(`
                        id, 
                        name, 
                        username, 
                        status, 
                        is_super_admin, 
                        created_at,
                        logs(
                            id,
                            note,
                            created_at,
                            customer_id,
                            customers:customer_id(
                                name
                            )
                        )
                        `)
                    .eq('id', WorkerId)
                    .order('created_at', { foreignTable: 'logs', ascending: false })
                    .limit(5, { foreignTable: 'logs' })
                    .single();

                if (error) throw error;
                setData(data);
            } catch (err: any) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchWorkerDetail();
    }, [WorkerId, refetchIndex]); // <-- Dependency array yang benar

    // --- Fungsi refetch ---
    const refetch = useCallback(() => {
        setRefetchIndex(prev => prev + 1);
    }, []);

    return { data, loading, error, refetch };
}