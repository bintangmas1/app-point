// services/authService.ts
import { supabase } from '../utils/supabase/client';

interface Admin {
    id: number;
    username: string;
    name?: string;
    [key: string]: any;
}

interface LoginResponse {
    success: boolean;
    admin?: Admin;
    error?: string;
}


// Fungsi login langsung ke database
export const loginAdmin = async (username: string, password: string): Promise<LoginResponse> => {
    try {

        // Validasi input
        if (!username || !password) {
            return {
                success: false,
                error: 'Username dan password harus diisi'
            };
        }

        // console.log('Querying admins table with:', { username, password });

        // Query admin dari database
        const { data, error, count } = await supabase
            .from('admins')
            .select('*', { count: 'exact' })
            .eq('username', username)
            .eq('password', password);

        if (error) {
            // console.error('Database query error:', error);
            return {
                success: false,
                error: `Database error: ${error.message}`
            };
        }

        // console.log('Query result:', { data, count });

        // Cek hasil query
        if (!data || data.length === 0) {
            return {
                success: false,
                error: 'Username atau password salah'
            };
        }

        // Ambil data admin pertama
        const adminData = data[0];

        // Simpan session
        const sessionData = {
            id: adminData.id,
            username: adminData.username,
            name: adminData.name || null,
            is_super_admin: adminData.is_super_admin || null,
            loginTime: new Date().toISOString()
        };

        // Simpan ke localStorage dengan expiry 24 jam
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);

        const session = {
            ...sessionData,
            expiry: expiryTime.toISOString()
        };

        localStorage.setItem('adminSession', JSON.stringify(session));

        // Return admin data (tanpa password)
        const { password: _, ...safeAdminData } = adminData;

        return {
            success: true,
            admin: safeAdminData
        };

    } catch (error) {
        // console.error('Unexpected login error:', error);
        return {
            success: false,
            error: 'Terjadi kesalahan tidak terduga'
        };
    }
};

// Fungsi untuk cek session (sama seperti sebelumnya)
export const getCurrentAdmin = (): Admin | null => {
    try {
        const sessionStr = localStorage.getItem('adminSession');

        if (!sessionStr) {
            return null;
        }

        const session = JSON.parse(sessionStr);

        // Cek apakah session masih valid
        const now = new Date();
        const expiry = new Date(session.expiry);

        if (now > expiry) {
            localStorage.removeItem('adminSession');
            return null;
        }

        return {
            id: session.id,
            username: session.username,
            name: session.name,
            is_super_admin: session.is_super_admin
        };
    } catch (error) {
        // console.error('Session parsing error:', error);
        localStorage.removeItem('adminSession');
        return null;
    }
};

// Fungsi logout (sama seperti sebelumnya)
export const logoutAdmin = (): void => {
    localStorage.removeItem('adminSession');
};

// Fungsi untuk cek apakah user sudah login (sama seperti sebelumnya)
export const isAdminLoggedIn = (): boolean => {
    return getCurrentAdmin() !== null;
};