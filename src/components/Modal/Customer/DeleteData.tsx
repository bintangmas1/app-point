// components/modals/DeleteCustomerModal.tsx
import React from 'react';

interface DeleteCustomerModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customerName?: string;
    loading?: boolean;
}

const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
    show,
    onClose,
    onConfirm,
    customerName = "",
    loading = false
}) => {
    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Konfirmasi Hapus</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            disabled={loading}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="alert alert-warning">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            <strong>Peringatan!</strong>
                        </div>
                        <p>Apakah Anda yakin ingin menghapus data <strong>{customerName}</strong>?</p>
                        <p className="text-muted">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Menghapus...
                                </>
                            ) : 'Hapus Customer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCustomerModal;