/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCustomers.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase/client";

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  point: number;
  status: boolean;
  created_at: string;
}

export interface Log {
  id: string;
  customer_id: string;
  admin_id: string;
  note: string;
  created_at: string;
}

export interface UpdateCustomerData {
  name?: string;
  address?: string;
  phone?: string;
  point?: number;
  status?: boolean;
}

export interface CustomerFilters {
  id?: string;
  status?: boolean;
  minPoint?: number;
  search?: string;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  withLogs?: boolean;
}

export interface CreateCustomerData {
  name: string;
  address?: string;
  phone?: string;
  point?: number;
  status: boolean;
}

export async function addCustomer(customerData: CreateCustomerData) {
  try {
    const completeCustomerData = {
      ...customerData,
      point: customerData.point !== undefined ? customerData.point : 0,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("customers") // Bukan "admins"
      .insert([completeCustomerData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Nama pelanggan sudah digunakan');
        }
        throw new Error('Data sudah ada di database');
      }
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// 1. Fungsi untuk menambah points customer
export async function addCustomerPoints(
  customerId: string,
  pointsToAdd: number
) {
  try {
    // Dapatkan points saat ini
    const { data: customerData, error: fetchError } = await supabase
      .from('customers')
      .select('point')
      .eq('id', customerId)
      .single();

    if (fetchError) throw fetchError;

    // Hitung points baru
    const currentPoints = customerData.point || 0;
    const newPoints = currentPoints + pointsToAdd;

    // Update dengan points baru
    const { data, error } = await supabase
      .from('customers')
      .update({ point: newPoints })
      .eq('id', customerId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// 2. Fungsi untuk menukar/mengurangi points customer
export async function redeemCustomerPoints(
  customerId: string,
  pointsToRedeem: number
) {
  try {
    // Dapatkan points saat ini
    const { data: customerData, error: fetchError } = await supabase
      .from('customers')
      .select('point')
      .eq('id', customerId)
      .single();

    if (fetchError) throw fetchError;

    const currentPoints = customerData.point || 0;

    // Validasi apakah points cukup
    if (currentPoints < pointsToRedeem) {
      throw new Error('Points tidak mencukupi');
    }

    // Hitung points baru (dikurangi)
    const newPoints = currentPoints - pointsToRedeem;

    // Update dengan points baru
    const { data, error } = await supabase
      .from('customers')
      .update({ point: newPoints })
      .eq('id', customerId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// 3. Fungsi untuk membuat log aktivitas
export async function createLog(logData: Omit<Log, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('logs')
      .insert([
        {
          customer_id: logData.customer_id,
          admin_id: logData.admin_id,
          note: logData.note,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// 4. Fungsi untuk update data customer
export async function updateCustomer(
  customerId: string,
  updateData: UpdateCustomerData
) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', customerId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// 5. Fungsi untuk delete customer
export async function deleteCustomer(customerId: string) {
  try {
    // Hapus logs terkait customer
    const { error: logError } = await supabase
      .from('logs')
      .delete()
      .eq('customer_id', customerId);

    // Hapus customer
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 6. Hook untuk get customers (versi yang diperbaiki)
export function useCustomers(filters: CustomerFilters = {}) {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from("customers").select(`
          id, 
          name, 
          address, 
          phone, 
          point, 
          status, 
          created_at
        `);

        // Jika filter dengan logs
        if (filters.withLogs) {
          query = supabase.from("customers").select(`
            id, 
            name, 
            address, 
            phone, 
            point, 
            status, 
            created_at,
            logs(
              id,
              note,
              created_at,
              admin_id,
              admins:admin_id(
                name
              )
            )
          `);

          // Order dan limit logs
          query = query.order('created_at', { foreignTable: 'logs', ascending: false });
          query = query.limit(5, { foreignTable: 'logs' });
        }

        // Terapkan filter berdasarkan parameter
        if (filters.id) {
          query = query.eq("id", filters.id);
        } else {
          // Filter hanya diterapkan jika bukan pencarian berdasarkan ID
          if (filters.status !== undefined) {
            query = query.eq("status", filters.status);
          }

          if (filters.minPoint !== undefined) {
            query = query.gte("point", filters.minPoint);
          }

          if (filters.search) {
            query = query.ilike("name", `%${filters.search}%`);
          }

          // Terapkan ordering
          if (filters.orderBy) {
            query = query.order(filters.orderBy, {
              ascending: filters.ascending ?? false,
            });
          } else {
            query = query.order("created_at", { ascending: false });
          }

          // Terapkan limit
          if (filters.limit) {
            query = query.limit(filters.limit);
          }
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

    fetchCustomers();
  }, [JSON.stringify(filters), refetchIndex]);

  const refetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}

// 7. Hook untuk get customer detail dengan logs
export function useCustomerDetail(customerId: string) {
  const [data, setData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    async function fetchCustomerDetail() {
      if (!customerId) {
        setData(null);
        // setLoading(false);
        return;
      }

      // setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('customers')
          .select(`
            id, 
            name, 
            address, 
            phone, 
            point, 
            status, 
            created_at,
            logs(
              id,
              note,
              created_at,
              admin_id,
              admins:admin_id(
                name
              )
            )
          `)
          .eq('id', customerId)
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

    fetchCustomerDetail();
  }, [customerId, refetchIndex]); // <-- Dependency array yang benar

  // --- Fungsi refetch ---
  const refetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}