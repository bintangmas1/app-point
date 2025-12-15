// components/NotificationContainer.tsx
import React, { useState } from 'react';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    show: boolean;
}

const NotificationContainer: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Fungsi untuk menambah notifikasi (akan dipanggil dari luar)
    const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
            id,
            message,
            type,
            show: true
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        }, 3000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Buat fungsi global yang bisa diakses dari window (untuk debugging/testing)
    if (typeof window !== 'undefined') {
        (window as any).showAppNotification = addNotification;
    }

    const getAlertClass = (type: string) => {
        switch (type) {
            case 'success': return 'alert-success';
            case 'error': return 'alert-danger';
            case 'warning': return 'alert-warning';
            case 'info': return 'alert-info';
            default: return 'alert-info';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <i className="bi bi-check-circle-fill me-2"></i>;
            case 'error': return <i className="bi bi-exclamation-triangle-fill me-2"></i>;
            case 'warning': return <i className="bi bi-exclamation-circle-fill me-2"></i>;
            case 'info': return <i className="bi bi-info-circle-fill me-2"></i>;
            default: return <i className="bi bi-info-circle-fill me-2"></i>;
        }
    };

    return (
        <div className="notification-container" style={{
            position: 'fixed',
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            width: '90%',
            maxWidth: '600px'
        }}>
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`alert ${getAlertClass(notification.type)} alert-dismissible fade show shadow-lg mb-3`}
                    style={{
                        width: '100%',
                        minWidth: '320px',
                        maxWidth: '600px',
                        pointerEvents: 'auto',
                        margin: 0
                    }}
                    role="alert"
                >
                    <div className="d-flex align-items-center">
                        {getIcon(notification.type)}
                        <div>{notification.message}</div>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => removeNotification(notification.id)}
                        aria-label="Close"
                    >
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;