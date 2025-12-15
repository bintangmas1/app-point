// src/pages/WorkerDataDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deleteWorker, updateWorker, useWorkerDetail } from "../../hooks/useWorkers";
import { getCurrentAdmin } from "../../service/Auth";
import { showNotification } from "../../utils/notification"; // Sesuaikan path
import DeleteCustomerModal from "../Modal/Customer/DeleteData";
import UpdateWorkerModal from "../Modal/Worker/EditData";

const formatDateTimeWIB = (dateString: string) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        });
        return `${formattedDate}, ${formattedTime} WIB`;
    } catch (error) {
        return dateString;
    }
};

const WorkerDataDetail = () => {
    const { id } = useParams();
    const { data: worker, loading, error, refetch } = useWorkerDetail(id || '');

    const navigate = useNavigate();
    const admin = getCurrentAdmin();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!admin) {
            navigate("/");
        }
    }, [admin, navigate]);

    const handleDeleteWorker = async () => {
        try {
            setIsSubmitting(true);
            const result = await deleteWorker(id!);
            if (result.error) {
                throw new Error(result.error);
            }
            navigate("/worker");
            showNotification("Pegawai berhasil dihapus!", "success");
        } catch (error: any) {
            showNotification(error.message || "Gagal menghapus pegawai", "error");
        } finally {
            setIsSubmitting(false);
            setShowDeleteModal(false);
        }
    };
    const handleUpdateWorker = async (updateData: { name: string; username: string; status: boolean }) => {
        try {
            setIsSubmitting(true);
            const result = await updateWorker(id!, updateData); // updateWorker dari useWorkers
            if (result.error) {
                throw new Error(result.error);
            }
            showNotification("Data pegawai berhasil diperbarui!", "success");
            setShowUpdateModal(false);
            refetch(); // Refresh data
        } catch (error: any) {
            showNotification(error.message || "Gagal memperbarui data pegawai", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
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
                    <div className="alert alert-danger">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!worker) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container">
                    <div className="alert alert-warning">
                        Pegawai tidak ditemukan.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content-wrapper py-3">
            <div className="container">
                {/* Card Informasi Pegawai */}
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="flex-grow-1">
                                <div className="text-center">
                                    <div
                                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-2"
                                        style={{ width: "80px", height: "80px" }}
                                    >
                                        <span className="text-white fw-bold" style={{ fontSize: "24px" }}>
                                            {worker.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h5>{worker.name}</h5>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                        <span
                                            className={`badge ${worker.status
                                                ? 'bg-success'
                                                : 'bg-danger'
                                                }`}
                                        >
                                            {worker.status ? 'Aktif' : 'Non-Aktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="ms-3">
                                {admin?.is_super_admin && (
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            title="Edit"
                                            onClick={() => setShowUpdateModal(true)}
                                        >
                                            <i className="bi bi-pencil"></i> Ubah
                                        </button>
                                        {worker.is_super_admin === false && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                title="Hapus"
                                                onClick={() => setShowDeleteModal(true)}
                                            >
                                                <i className="bi bi-trash"></i> Hapus
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <h6>Informasi Pegawai</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Nama</span>
                                <strong>{worker.name}</strong>
                            </li>

                            {admin?.is_super_admin && (
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted">Username</span>
                                    <small className="text-end" style={{ maxWidth: "70%" }}>
                                        {worker.username || '-'}
                                    </small>
                                </li>
                            )}
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Role</span>
                                <span>
                                    {worker.is_super_admin ? 'Admin' : 'Pegawai'}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Status Akun</span>
                                <span className={`badge ${worker.status
                                    ? 'bg-success'
                                    : 'bg-danger'
                                    }`}>
                                    {worker.status ? 'Aktif' : 'Non-Aktif'}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Tanggal Bergabung</span>
                                <small>
                                    {worker.created_at ? formatDateTimeWIB(worker.created_at) : '-'}
                                </small>
                            </li>
                        </ul>
                    </div>
                </div>

                {worker?.logs && (
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">5 Aktivitas terahir</h6>
                        </div>
                        <div className="logs-container">
                            {worker.logs.length > 0 ? (
                                worker.logs.map((log: any) => (
                                    <div
                                        key={log.id}
                                        className="log-item card mb-2 border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="flex-grow-1">
                                                    <p className="mb-0" style={{ fontSize: '16px' }}>{log.note} </p>
                                                    <strong className="mb-2">kepada {log.customers?.name || ''}</strong>
                                                    <div className="d-flex mt-3 flex-wrap gap-2">
                                                        <small className="text-muted me-3">
                                                            <i className="bi bi-calendar me-1"></i>
                                                            {formatDateTimeWIB(log.created_at)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 bg-dark rounded-3">
                                    <i className="bi bi-journal-text" style={{ fontSize: '2rem' }}></i>
                                    <p className="mb-0 mt-2 text-muted">Belum ada activity log</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <UpdateWorkerModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onSubmit={handleUpdateWorker}
                workerData={{
                    name: worker.name,
                    username: worker.username,
                    status: worker.status
                }}
                loading={isSubmitting}
            />
            {/* Modal Delete */}
            <DeleteCustomerModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteWorker}
                customerName={worker.name}
                loading={isSubmitting}
            />
        </div>
    );
};

export default WorkerDataDetail;