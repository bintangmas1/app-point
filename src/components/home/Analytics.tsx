import React from "react";
import { useCustomerStats } from "../../hooks/useCustomers";

const Analytics = () => {
    const { stats, loading, error } = useCustomerStats();

    if (loading) {
        return (
            <div className="container mb-3">
                <div className="row g-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div className="col-6" key={i}>
                            <div className="card border-0 shadow-sm rounded-3 h-100">
                                <div className="card-body p-3 d-flex align-items-center justify-content-center">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return null; // Hide if error
    }

    const statItems = [
        {
            title: "Total Pelanggan",
            value: stats.totalCustomers,
            icon: "people",
            color: "primary",
            bg: "bg-primary-subtle",
        },
        {
            title: "Pelanggan Aktif",
            value: stats.activeCustomers,
            icon: "person-check",
            color: "success",
            bg: "bg-success-subtle",
        },
        {
            title: "Total Poin",
            value: stats.totalPoints.toLocaleString(),
            icon: "star",
            color: "warning",
            bg: "bg-warning-subtle",
        },
        {
            title: "Pelanggan Baru",
            value: stats.newCustomersThisMonth,
            icon: "person-plus",
            color: "info",
            bg: "bg-info-subtle",
            subtitle: "Bulan Ini"
        },
    ];

    return (
        <div className="container mb-3">
            <div className="row g-2">
                {statItems.map((item, index) => (
                    <div className="col-6" key={index}>
                        <div className="card border-0 shadow-sm rounded-3 h-100">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div
                                        className={`rounded-circle d-flex align-items-center justify-content-center ${item.bg} text-${item.color}`}
                                        style={{ width: "36px", height: "36px" }}
                                    >
                                        <i className={`bi bi-${item.icon}`}></i>
                                    </div>
                                    <div className="ms-auto">
                                        {item.subtitle && (
                                            <span className="badge bg-light text-muted border rounded-pill" style={{ fontSize: '0.6rem' }}>
                                                {item.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h4 className="fw-bold mb-0 text-dark">{item.value}</h4>
                                <div className="small text-muted">{item.title}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;
