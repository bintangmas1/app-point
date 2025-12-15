import React, { useState, useMemo } from "react";
import { useLogs } from "../../hooks/useLogs";

const LogsData = () => {
    const formatDateTimeWIB = (dateString) => {
        if (!dateString) return "-";

        try {
            const date = new Date(dateString);

            // Format tanggal
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Format waktu dengan WIB
            const formattedTime = date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
            });

            return `${formattedDate}, ${formattedTime} WIB`;
        } catch (error) {
            return dateString; // fallback ke format asli
        }
    };


    const { data: AllLogs, loading, error } = useLogs({
        orderBy: "created_at",
        ascending: false
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Filter data - perbaikan nama field
    const filteredData = useMemo(() => {
        if (!AllLogs || !Array.isArray(AllLogs)) return [];
        if (!searchQuery) return AllLogs;

        return AllLogs.filter((log) => {
            const adminName = log.admins?.name || ""; // admins (bentuk jamak)
            const customerName = log.customers?.name || ""; // customers (bentuk jamak)
            const note = log.note || "";
            const dateTime = formatDateTimeWIB(log.created_at).toLowerCase();

            const searchLower = searchQuery.toLowerCase();

            return (
                adminName.toLowerCase().includes(searchLower) ||
                customerName.toLowerCase().includes(searchLower) ||
                note.toLowerCase().includes(searchLower) ||
                dateTime.toLowerCase().includes(searchLower)
            );
        });
    }, [AllLogs, searchQuery]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

    const currentItems = useMemo(() => {
        if (!filteredData) return [];
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle loading and error states
    if (loading) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container">
                    <div className="card">
                        <div className="card-body text-center text-danger">
                            Error: {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content-wrapper py-3">
            <div className="container">
                <div className="card">
                    <div className="card-body p-3">
                        <h5 className="mb-3">Riwayat Aktivitas</h5>

                        {/* Search */}
                        <div className="dataTable-search mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari log..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tampilan Mobile: Alert Style Sederhana */}
                        <div className="">
                            {currentItems && currentItems.length > 0 ? (
                                currentItems.map((log) => (
                                    <div
                                        key={log.id}
                                        className="alert custom-alert-3 alert fade show mb-3"
                                        role="alert">
                                        <i className="bi bi-journal-text me-3 mt-1"></i>
                                        <div className="alert-text">
                                            <h6 className="mb-1">{log.admins?.name || "Unknown"}</h6>
                                            <p>Pelanggan : {log.customers?.name || "Unknown Customer"}</p>
                                            <p className="mb-1 small">{log.note || "-"}</p>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">
                                                    {formatDateTimeWIB(log.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="alert alert-info text-center">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Tidak ada log aktivitas ditemukan.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            &laquo;
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => goToPage(page)}>
                                                {page}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}

                        {/* Info jumlah data */}
                        <div className="text-center text-muted mt-3">
                            Menampilkan {currentItems?.length || 0} dari {filteredData?.length || 0} data
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsData;