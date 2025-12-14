import React from "react";
import { useRecentLogs } from "../../hooks/useCustomers";

const RecentActivity = () => {
    const { logs, loading, error } = useRecentLogs(5);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="container mb-3">
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-3 text-center">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || logs.length === 0) {
        return null;
    }

    return (
        <div className="container mb-3">
            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-transparent border-0 pt-3 pb-2">
                    <h6 className="mb-0 fw-bold d-flex align-items-center">
                        <i className="bi bi-activity me-2 text-primary"></i>
                        Aktivitas Terbaru
                    </h6>
                </div>
                <div className="card-body p-0">
                    <div className="list-group list-group-flush rounded-bottom-3">
                        {logs.map((log) => (
                            <div key={log.id} className="list-group-item border-0 py-3 px-3 d-flex align-items-start">
                                <div className="bg-light rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-clock-history text-muted"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <span className="fw-bold text-dark small">{log.customers?.name || "Pelanggan"}</span>
                                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                            {formatDate(log.created_at)}
                                        </small>
                                    </div>
                                    <p className="mb-0 small text-muted lh-sm">{log.note}</p>
                                    <div className="mt-1">
                                        <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.6rem' }}>
                                            Oleh: {log.admins?.name || "Admin"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
