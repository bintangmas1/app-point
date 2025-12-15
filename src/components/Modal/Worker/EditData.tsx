// components/modals/UpdateWorkerModal.tsx
import React, { useState, useEffect } from 'react';

interface UpdateWorkerModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; username: string; status: boolean }) => void;
    workerData?: {
        name: string;
        username: string;
        status: boolean;
    };
    loading?: boolean;
}

interface FormData {
    name: string;
    username: string;
    status: boolean;
}

const UpdateWorkerModal: React.FC<UpdateWorkerModalProps> = ({
    show,
    onClose,
    onSubmit,
    workerData,
    loading = false
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        username: '',
        status: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (show && workerData) {
            setFormData({
                name: workerData.name || '',
                username: workerData.username || '',
                status: workerData.status !== undefined ? workerData.status : true
            });
            setErrors({});
        } else {
            setFormData({
                name: '',
                username: '',
                status: true
            });
            setErrors({});
        }

        // Disable body scroll when modal is open
        if (show) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [show, workerData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleStatusChange = (status: boolean) => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    const validateForm = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama pegawai harus diisi';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username harus diisi';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username minimal 3 karakter';
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit({
            name: formData.name.trim(),
            username: formData.username.trim(),
            status: formData.status
        });
    };

    const handleClose = () => {
        setFormData({
            name: '',
            username: '',
            status: true
        });
        setErrors({});
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Data Pegawai</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            disabled={loading}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Masukkan nama lengkap"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    placeholder="Masukkan username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                {errors.username && (
                                    <div className="invalid-feedback">{errors.username}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="statusSwitch"
                                        checked={formData.status}
                                        onChange={(e) => handleStatusChange(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor="statusSwitch">
                                        {formData.status ? (
                                            <span className="badge bg-success">Aktif</span>
                                        ) : (
                                            <span className="badge bg-danger">Non-Aktif</span>
                                        )}
                                    </label>
                                </div>
                            </div>
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
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        Menyimpan...
                                    </>
                                ) : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateWorkerModal;