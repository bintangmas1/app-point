// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { loginAdmin, getCurrentAdmin, logoutAdmin, isAdminLoggedIn } from '../services/authService';

interface UseAuthReturn {
    isLoggedIn: boolean;
    admin: any;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek session saat component mount
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const currentAdmin = getCurrentAdmin();
        if (currentAdmin) {
            setIsLoggedIn(true);
            setAdmin(currentAdmin);
        } else {
            setIsLoggedIn(false);
            setAdmin(null);
        }
        setLoading(false);
    };

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const result = await loginAdmin(username, password);

            if (result.success) {
                setIsLoggedIn(true);
                setAdmin(result.admin);
            }

            setLoading(false);
            return { success: result.success, error: result.error };
        } catch (error) {
            setLoading(false);
            return { success: false, error: 'Login failed' };
        }
    };

    const logout = () => {
        logoutAdmin();
        setIsLoggedIn(false);
        setAdmin(null);
    };

    return {
        isLoggedIn,
        admin,
        login,
        logout,
        loading
    };
};