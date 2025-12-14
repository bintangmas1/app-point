import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCustomer, useCustomers, deleteCustomers, updateCustomer, getMemberLevel } from "../../hooks/useCustomers";
import { getCurrentAdmin } from "../../service/Auth";
import AddCustomer from "../Modal/Customer/AddData";
import { showNotification } from "../../utils/notification";

const CustomersData = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(AllCustomers.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Hapus ${selectedIds.length} pelanggan terpilih?`)) {
            const { error } = await deleteCustomers(selectedIds);
            if (error) {
                showNotification(`Gagal menghapus: ${error}`, "error");
            } else {
                showNotification(`${selectedIds.length} pelanggan berhasil dihapus`, "success");
                setSelectedIds([]);
                refetch();
            }
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await updateCustomer(id, { status: !currentStatus });
            if (error) throw new Error(error);
            showNotification("Status berhasil diperbarui", "success");
            refetch();
        } catch (err: any) {
            showNotification(err.message, "error");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const {
        data: AllCustomers,
        count,
        loading,
        error,
        refetch,
    } = useCustomers({
        orderBy: "name",
        ascending: true,
        page,
        pageSize,
        search: debouncedSearch
    });

    const navigate = useNavigate();
    const admin = getCurrentAdmin();

    useEffect(() => {
        if (!admin) {
            navigate("/");
        }
    }, [admin, navigate]);

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleAddCustomer = async (customerData: {
        name: string;
        address: string;
        phone: string;
        point: number;
        status: boolean;
    }) => {
        try {
            setIsSubmitting(true);
            const result = await addCustomer(customerData);
            if (result.error) {
                throw new Error(result.error);
            }
            setShowModal(false);
            showNotification("Pelanggan berhasil ditambahkan!", "success");
            refetch();
        } catch (error: any) {
            showNotification(error.message || "Gagal menambahkan pelanggan", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const totalPages = Math.ceil((count || 0) / pageSize);

    if (loading && page === 1 && !debouncedSearch) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container text-center">
                    <p>Memuat data pelanggan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container text-center text-danger">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content-wrapper py-3" id="elementsSearchList">
            <div className="container">

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        {/* Header & Bulk Actions */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            {selectedIds.length > 0 ? (
                                <div className="d-flex align-items-center gap-3 w-100 p-2 bg-primary-subtle rounded-3 text-primary animate__animated animate__fadeIn">
                                    <div className="fw-bold ps-2">{selectedIds.length} Dipilih</div>
                                    <div className="ms-auto d-flex gap-2">
                                        <button className="btn btn-danger btn-sm d-flex align-items-center gap-2" onClick={handleBulkDelete}>
                                            <i className="bi bi-trash"></i> Hapus
                                        </button>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedIds([])}>
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h5 className="mb-1 fw-bold">Data Pelanggan</h5>
                                        <p className="text-muted mb-0 small">Total: {count || 0} Pelanggan</p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                            style={{ width: '42px', height: '42px' }}
                                            onClick={() => setShowModal(true)}
                                            title="Tambah Pelanggan Baru"
                                        >
                                            <i className="bi bi-plus-lg fs-5"></i>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="input-group shadow-sm rounded-pill overflow-hidden" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
                                <span className="input-group-text border-0 bg-transparent ps-3">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    id="elementsSearchInput"
                                    placeholder="Cari nama, alamat, atau no hp..."
                                    className="form-control border-0 bg-transparent py-2 text-body"
                                    style={{ boxShadow: 'none' }}
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-link text-muted border-0 bg-transparent pe-3 text-decoration-none"
                                        onClick={() => setSearchTerm("")}
                                        style={{ boxShadow: 'none' }}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabel Pelanggan */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Memuat data...</p>
                            </div>
                        ) : AllCustomers.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                    <thead className="text-muted text-uppercase small">
                                        <tr>
                                            <th className="border-0 ps-3" style={{ width: '40px' }}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={AllCustomers.length > 0 && selectedIds.length === AllCustomers.length}
                                                    />
                                                </div>
                                            </th>
                                            <th className="border-0 fw-semibold">Nama Pelanggan</th>
                                            <th className="border-0 fw-semibold d-none d-md-table-cell">Kontak</th>
                                            <th className="border-0 fw-semibold text-center">Poin</th>
                                            <th className="border-0 fw-semibold text-center">Status</th>
                                            <th className="border-0 fw-semibold text-end pe-3">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {AllCustomers.map((item, index) => (
                                            <tr key={item.id} className="shadow-sm hover-shadow transition rounded-3 bg-body-tertiary">
                                                <td className="border-0 py-3 ps-3 rounded-start-3">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={selectedIds.includes(item.id)}
                                                            onChange={() => handleSelectOne(item.id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="border-0 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <div className="fw-bold d-flex align-items-center gap-2">
                                                                {item.name}
                                                                <span className={`badge bg-${getMemberLevel(item.point).color}-subtle text-${getMemberLevel(item.point).color} rounded-pill px-2 py-1`} style={{ fontSize: '0.65rem' }}>
                                                                    <i className={`bi bi-${getMemberLevel(item.point).icon} me-1`}></i>
                                                                    {getMemberLevel(item.point).name}
                                                                </span>
                                                            </div>
                                                            <div className="small text-muted d-md-none text-truncate" style={{ maxWidth: '150px' }}>{item.address}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-0 py-3 d-none d-md-table-cell">
                                                    <div className="d-flex flex-column">
                                                        <span className="small mb-1 text-truncate" style={{ maxWidth: '200px' }}>
                                                            <i className="bi bi-geo-alt me-1 text-muted"></i>{item.address || "-"}
                                                        </span>
                                                        <span className="text-muted small">
                                                            <i className="bi bi-telephone me-1 text-muted"></i>{item.phone || "-"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="border-0 py-3 text-center">
                                                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
                                                        {item.point} Poin
                                                    </span>
                                                </td>
                                                <td className="border-0 py-3 text-center">
                                                    <div className="form-check form-switch d-flex justify-content-center">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={item.status}
                                                            onChange={() => handleToggleStatus(item.id, item.status)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="border-0 py-3 text-end pe-3 rounded-end-3">
                                                    <Link
                                                        to={`/customer/detail/${item.id}`}
                                                        className="btn btn-sm btn-light rounded-circle"
                                                        style={{ width: '32px', height: '32px', padding: 0, lineHeight: '32px' }}
                                                        title="Lihat Detail"
                                                    >
                                                        <i className="bi bi-chevron-right"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <div className="mb-3">
                                    <i className="bi bi-inbox fs-1 text-muted opacity-50"></i>
                                </div>
                                <h6 className="fw-bold">Tidak ada data ditemukan</h6>
                                <p className="small">Coba kata kunci pencarian lain atau tambahkan pelanggan baru.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <small className="text-muted">
                                    Menampilkan {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, count || 0)} dari {count} data
                                </small>
                                <nav aria-label="Page navigation">
                                    <ul className="pagination pagination-sm mb-0 gap-1">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link border-0 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: '32px', height: '32px' }}
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                        </li>
                                        <li className="page-item disabled">
                                            <span className="page-link border-0 bg-transparent fw-bold px-2">
                                                {page} / {totalPages}
                                            </span>
                                        </li>
                                        <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link border-0 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: '32px', height: '32px' }}
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page >= totalPages}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            {/* Modal Tambah Pelanggan */}
            <AddCustomer
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddCustomer}
                loading={isSubmitting}
            />
        </div>
    );
};

export default CustomersData;
