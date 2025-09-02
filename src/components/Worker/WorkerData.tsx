import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkers, addWorker } from "../../hooks/useWorkers";
import AddWorkerModal from "../Modal/Worker/AddWorker";
import { getCurrentAdmin } from "../../service/Auth";
import { showNotification } from "../../utils/notification";

const WorkersData = () => {
    const {
        data: AllWorkers,
        loading,
        error,
        refetch
    } = useWorkers({
        orderBy: "name",
        ascending: true,
    });

    const navigate = useNavigate();
    const admin = getCurrentAdmin();

    useEffect(() => {
        if (!admin) {
            navigate("/");
        }
    }, [admin, navigate]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleAddWorker = async (workerData) => {
        try {
            setIsSubmitting(true);
            const result = await addWorker(workerData);
            if (result.error) {
                throw new Error(result.error);
            }
            setShowModal(false);
            showNotification("Pegawai berhasil ditambahkan!", "success");
            refetch();
        } catch (error: any) {
            if (error.message.includes('username')) {
                showNotification(error.message, "error");
            } else {
                showNotification(error.message || "Gagal menambahkan pegawai");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredAndSortedItems = useMemo(() => {
        return AllWorkers.filter((item) => {
            const nameMatch = item.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            return nameMatch;
        });
    }, [AllWorkers, searchTerm]);

    if (loading) {
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 className="mb-0">Semua Pegawai</h6>
                        <small className="text-muted">Daftar semua pegawai toko</small>
                    </div>
                    {admin?.is_super_admin && (
                        <button
                            className="btn btn-primary btn-sm rounded-pill px-3 py-2"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => setShowModal(true)}
                        >
                            <i className="bi bi-plus-circle me-1"></i>
                            Tambah
                        </button>
                    )}
                </div>
                <div className="mb-3">
                    <div className="form-group mb-0">
                        <input
                            type="text"
                            id="elementsSearchInput"
                            placeholder="Cari pegawai..."
                            className="form-control"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Daftar Pelanggan */}
                {filteredAndSortedItems.length > 0 ? (
                    filteredAndSortedItems.map((item) => (
                        <Link
                            key={item.name}
                            to={`/worker/detail/${item.id}`}
                            className={`affan-element-item d-flex align-items-center justify-content-between text-decoration-none `}
                        >
                            <div className="d-flex align-items-center">
                                <img
                                    className="rounded-circle bg-warning"
                                    width="40"
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                    src="/assets/img/menus/worker.png"
                                    alt=""
                                />
                            </div>

                            <div className="flex-fill ms-4">
                                <strong>{item.name}</strong>
                                <br />
                                <small className="text-muted">{item.is_super_admin ? "Admin" : "Pegawai"}</small>
                                <br />
                            </div>

                            <span
                                className={`badge ms-2 ${item.status ? "bg-success" : "bg-danger"}`}
                                style={{ fontSize: "0.75em" }}
                            >
                                <i className={`bi ${item.status ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
                                {item.status ? "Aktif" : "Non-Aktif"}
                            </span>
                            <i className="bi bi-caret-right-fill fz-12"></i>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-muted mt-3">
                        Tidak ada pelanggan ditemukan.
                    </p>
                )}
            </div>
            {/* Modal Tambah Pegawai */}
            <AddWorkerModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddWorker}
                loading={isSubmitting}
            />
        </div>
    );
};

export default WorkersData;
