// src/pages/CustomerDetailData.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    useCustomerDetail,
    addCustomerPoints,
    redeemCustomerPoints,
    updateCustomer,
    deleteCustomer,
    createLog
} from "../../hooks/useCustomers";
import { getCurrentAdmin } from "../../service/Auth";
import AddPointsModal from "../Modal/Customer/AddPoint";
import RedeemPointsModal from "../Modal/Customer/ReedemPoint";
import EditCustomerModal from "../Modal/Customer/EditData";
import DeleteCustomerModal from "../Modal/Customer/DeleteData";
import { showNotification } from "../../utils/notification";

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

const CustomerDetailData = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const admin = getCurrentAdmin();
    const { data: customer, loading, error, refetch } = useCustomerDetail(id || '');
    const [showAddPointsModal, setShowAddPointsModal] = useState(false);
    const [showRedeemPointsModal, setShowRedeemPointsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!admin) {
            navigate("/");
        }
    }, [admin, navigate]);

    const handleAddPoints = async (formData: { points: string; note: string }) => {
        if (!customer || !admin) return;
        setIsSubmitting(true);
        try {
            const addPointsResult = await addCustomerPoints(
                customer.id,
                parseInt(formData.points, 10)
            );
            if (addPointsResult.error) {
                throw new Error('Gagal menambah points: ' + addPointsResult.error);
            }
            const logResult = await createLog({
                customer_id: customer.id,
                admin_id: admin.id,
                note: `Menambahkan ${formData.points} points: ${formData.note}`
            });
            if (logResult.error) {
                showNotification('Gagal membuat log (tapi points sudah ditambah): ' + logResult.error, "error");
            }
            await refetch();
            setShowAddPointsModal(false);
            showNotification('Poin berhasil ditambahkan!', "success");
        } catch (error: any) {
            showNotification('Error: ' + error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRedeemPoints = async (formData: { points: string; note: string }) => {
        if (!customer || !admin) return;
        setIsSubmitting(true);
        try {
            const redeemPointsResult = await redeemCustomerPoints(
                customer.id,
                parseInt(formData.points, 10)
            );
            if (redeemPointsResult.error) {
                throw new Error('Gagal menukar points: ' + redeemPointsResult.error);
            }
            const logResult = await createLog({
                customer_id: customer.id,
                admin_id: admin.id,
                note: `Menukar ${formData.points} points: ${formData.note}`
            });
            if (logResult.error) {
                showNotification('Gagal membuat log (tapi points sudah dikurangi): ' + logResult.error, "error");
            }
            await refetch();
            setShowRedeemPointsModal(false);
            showNotification('Poin berhasil ditukar!', "success");
        } catch (error: any) {
            showNotification('Error: ' + error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCustomer = async (formData: { name: string; address: string; phone: string; status: boolean }) => {
        if (!customer || !admin) return;
        setIsSubmitting(true);
        try {
            const updateResult = await updateCustomer(customer.id, formData);
            if (updateResult.error) {
                throw new Error('Gagal update customer: ' + updateResult.error);
            }
            const logResult = await createLog({
                customer_id: customer.id,
                admin_id: admin.id,
                note: `Mengupdate data customer: ${formData.name}`
            });
            if (logResult.error) {
                console.warn('Gagal membuat log update:', logResult.error);
                showNotification('Data admin tidak ditemukan', "error");
            }
            await refetch();
            setShowEditModal(false);
            showNotification('Data customer berhasil diupdate!', "success");
        } catch (error: any) {
            showNotification('Error: ' + error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCustomer = async () => {
        if (!customer || !admin) return;
        setIsSubmitting(true);
        try {
            const deleteResult = await deleteCustomer(customer.id);
            if (deleteResult.error) {
                throw new Error('Gagal hapus customer: ' + deleteResult.error);
            }
            const logResult = await createLog({
                admin_id: admin.id,
                note: `Menghapus customer: ${customer.name}`
            });
            if (logResult.error) {
                showNotification('Gagal membuat log hapus: ' + logResult.error, "error");
            }
            setShowDeleteModal(false);
            showNotification('Customer berhasil dihapus!', "success");
            setTimeout(() => navigate('/pelanggan'), 100);
        } catch (error: any) {
            showNotification('Error: ' + error.message, "error");
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

    if (!customer) {
        return (
            <div className="page-content-wrapper py-3">
                <div className="container">
                    <div className="alert alert-warning" role="alert">
                        <h4 className="alert-heading">Tidak Ditemukan!</h4>
                        <p>Data pelanggan tidak tersedia.</p>
                        <button
                            className="btn btn-outline-warning me-2"
                            onClick={() => navigate(-1)}
                        >
                            Kembali
                        </button>
                        <Link to="/pelanggan" className="btn btn-outline-warning">
                            Ke Daftar Pelanggan
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const customerLevel = customer.point >= 100 ? "Platinum" :
        customer.point >= 50 ? "Gold" :
            customer.point >= 10 ? "Silver" : "Bronze";

    return (
        <div className="page-content-wrapper py-3">
            <div className="container">
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
                                            {customer.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h5>{customer.name}</h5>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                        <span
                                            className={`badge ${customer.status
                                                ? 'bg-success'
                                                : 'bg-danger'
                                                }`}
                                        >
                                            {customer.status ? 'Aktif' : 'Non-Aktif'}
                                        </span>
                                        <span className={`badge ${customerLevel === "Platinum" ? "bg-warning text-dark" :
                                            customerLevel === "Gold" ? "bg-warning text-dark" :
                                                customerLevel === "Silver" ? "bg-secondary" : "bg-light text-dark"
                                            }`}>
                                            {customerLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="ms-3">
                                <div className="d-flex flex-column gap-2">
                                    <button
                                        className="btn btn-success btn-sm"
                                        title="Tambah Points"
                                        onClick={() => setShowAddPointsModal(true)}
                                    >
                                        <i className="bi bi-plus-circle"></i>
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        title="Tukar Poin"
                                        onClick={() => setShowRedeemPointsModal(true)}
                                    >
                                        <i className="bi bi-arrow-down-circle"></i>
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        title="Edit"
                                        onClick={() => setShowEditModal(true)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        title="Hapus"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AddPointsModal
                    show={showAddPointsModal}
                    onClose={() => setShowAddPointsModal(false)}
                    onSubmit={handleAddPoints}
                    customerName={customer.name}
                    loading={isSubmitting}
                />
                <RedeemPointsModal
                    show={showRedeemPointsModal}
                    onClose={() => setShowRedeemPointsModal(false)}
                    onSubmit={handleRedeemPoints}
                    customerName={customer.name}
                    currentPoints={customer.point || 0}
                    loading={isSubmitting}
                />
                <EditCustomerModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleEditCustomer}
                    customer={customer}
                    loading={isSubmitting}
                />
                <DeleteCustomerModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteCustomer}
                    customerName={customer.name}
                    loading={isSubmitting}
                />

                <div className="card mb-3">
                    <div className="card-body">
                        <h6>Informasi Pelanggan</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Nama</span>
                                <strong>{customer.name}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Alamat</span>
                                <small className="text-end" style={{ maxWidth: "70%" }}>
                                    {customer.address || '-'}
                                </small>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Telepon</span>
                                <small className="text-end" style={{ maxWidth: "70%" }}>
                                    {customer.phone || '-'}
                                </small>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Status</span>
                                <span className={`badge ${customer.status
                                    ? 'bg-success'
                                    : 'bg-danger'
                                    }`} >
                                    {customer.status ? 'Aktif' : 'Non-Aktif'}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <span className="text-muted">Total Point</span>
                                <span className="text-warning fw-bold fs-5">{customer.point}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Level</span>
                                <span className={`badge ${customerLevel === "Platinum" ? "bg-warning text-dark" :
                                    customerLevel === "Gold" ? "bg-warning text-dark" :
                                        customerLevel === "Silver" ? "bg-secondary" : "bg-light text-dark"
                                    }`} >
                                    {customerLevel}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {customer?.logs && (
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">5 Aktivitas terahir</h6>
                        </div>
                        <div className="logs-container">
                            {customer.logs.length > 0 ? (
                                customer.logs.map((log: any) => (
                                    <div
                                        key={log.id}
                                        className="log-item card mb-2 border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="flex-grow-1">
                                                    <p className="mb-2" style={{ fontSize: '16px' }}>{log.note}</p>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <small className="me-3">
                                                            <i className="bi bi-person me-1"></i>
                                                            {log.admins?.name || 'Unknown User'}
                                                        </small>
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
        </div>
    );
};

export default CustomerDetailData;