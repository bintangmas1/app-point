// utils/notification.ts
export const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (typeof window !== 'undefined' && (window as any).showAppNotification) {
        (window as any).showAppNotification(message, type);
    } else {
        // Fallback untuk development
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};