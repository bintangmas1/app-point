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
  page?: number;
  pageSize?: number;
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
      .from("customers")
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

export async function addCustomerPoints(
  customerId: string,
  pointsToAdd: number
) {
  try {
    const { data: customerData, error: fetchError } = await supabase
      .from('customers')
      .select('point')
      .eq('id', customerId)
      .single();

    if (fetchError) throw fetchError;

    const currentPoints = customerData.point || 0;
    const newPoints = currentPoints + pointsToAdd;

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

export async function redeemCustomerPoints(
  customerId: string,
  pointsToRedeem: number
) {
  try {
    const { data: customerData, error: fetchError } = await supabase
      .from('customers')
      .select('point')
      .eq('id', customerId)
      .single();

    if (fetchError) throw fetchError;

    const currentPoints = customerData.point || 0;

    if (currentPoints < pointsToRedeem) {
      throw new Error('Points tidak mencukupi');
    }

    const newPoints = currentPoints - pointsToRedeem;

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

export async function deleteCustomer(customerId: string) {
  try {
    await supabase
      .from('logs')
      .delete()
      .eq('customer_id', customerId);

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

export async function deleteCustomers(customerIds: string[]) {
  try {
    await supabase
      .from('logs')
      .delete()
      .in('customer_id', customerIds);

    const { error } = await supabase
      .from('customers')
      .delete()
      .in('id', customerIds);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export function useCustomers(filters: CustomerFilters = {}) {
  const [data, setData] = useState<Customer[]>([]);
  const [count, setCount] = useState<number>(0);
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
        `, { count: 'exact' });

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
          `, { count: 'exact' });

          query = query.order('created_at', { foreignTable: 'logs', ascending: false });
          query = query.limit(5, { foreignTable: 'logs' });
        }

        if (filters.id) {
          query = query.eq("id", filters.id);
        } else {
          if (filters.status !== undefined) {
            query = query.eq("status", filters.status);
          }

          if (filters.minPoint !== undefined) {
            query = query.gte("point", filters.minPoint);
          }

          if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
          }

          if (filters.orderBy) {
            query = query.order(filters.orderBy, {
              ascending: filters.ascending ?? false,
            });
          } else {
            query = query.order("created_at", { ascending: false });
          }

          if (filters.limit) {
            query = query.limit(filters.limit);
          } else if (filters.page !== undefined && filters.pageSize !== undefined) {
            const from = (filters.page - 1) * filters.pageSize;
            const to = from + filters.pageSize - 1;
            query = query.range(from, to);
          }
        }

        const { data, error, count } = await query;

        if (error) throw error;
        setData(data || []);
        setCount(count || 0);
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

  return { data, count, loading, error, refetch };
}

export function useCustomerDetail(customerId: string) {
  const [data, setData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    async function fetchCustomerDetail() {
      if (!customerId) {
        setData(null);
        return;
      }

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
  }, [customerId, refetchIndex]);

  const refetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}

export function useCustomerStats() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalPoints: 0,
    newCustomersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        const { count: total, error: errTotal } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });

        if (errTotal) throw errTotal;

        const { count: active, error: errActive } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('status', true);

        if (errActive) throw errActive;

        const { data: pointsData, error: errPoints } = await supabase
          .from('customers')
          .select('point');

        if (errPoints) throw errPoints;
        const totalPoints = pointsData?.reduce((sum, c) => sum + (c.point || 0), 0) || 0;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: newCust, error: errNew } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString());

        if (errNew) throw errNew;

        setStats({
          totalCustomers: total || 0,
          activeCustomers: active || 0,
          totalPoints,
          newCustomersThisMonth: newCust || 0
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useRecentLogs(limit: number = 5) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('logs')
          .select(`
            id,
            note,
            created_at,
            customer_id,
            customers:customer_id ( name ),
            admin_id,
            admins:admin_id ( name )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setLogs(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [limit]);

  return { logs, loading, error };
}

export const getMemberLevel = (point: number) => {
  if (point >= 500) return { name: 'Platinum', color: 'info', icon: 'gem' };
  if (point >= 100) return { name: 'Gold', color: 'warning', icon: 'trophy' };
  return { name: 'Silver', color: 'secondary', icon: 'award' };
};