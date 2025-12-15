// components/modals/AddCustomer.tsx
import React, { useState, useEffect } from 'react';

interface AddCustomerProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        address: string;
        phone: string;
        point: number;
        status: boolean;
    }) => void;
    loading?: boolean;
}

interface FormData {
    name: string;
    address: string;
    phone: string;
    point: string; // akan diubah ke number saat submit
    status: boolean;
}

const AddCustomer: React.FC<AddCustomerProps> = ({
    show,
    onClose,
    onSubmit,
    loading = false
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        address: '',
        phone: '',
        point: '',
        status: true // default aktif
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (show) {
            setFormData({
                name: '',
                address: '',
                phone: '',
                point: '',
                status: true
            });
            setErrors({});

            // Disable body scroll when modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else {
            // Enable body scroll when modal is closed
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [show]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            newErrors.name = 'Nama pelanggan harus diisi';
        }

        if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = 'Format nomor telepon tidak valid';
        }

        if (formData.point && isNaN(Number(formData.point))) {
            newErrors.point = 'Poin harus berupa angka';
        } else if (formData.point && Number(formData.point) < 0) {
            newErrors.point = 'Poin tidak boleh negatif';
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

        // Konversi point ke number, jika kosong set ke 0
        const pointValue = formData.point.trim() === '' ? 0 : parseInt(formData.point) || 0;

        onSubmit({
            name: formData.name.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            point: pointValue,
            status: formData.status
        });
    };

    const handleClose = () => {
        setFormData({
            name: '',
            address: '',
            phone: '',
            point: '',
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
                        <h5 className="modal-title">Tambah Pelanggan Baru</h5>
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
                                <label className="form-label">Alamat</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    rows={2}
                                    placeholder="Masukkan alamat"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    placeholder="Masukkan nomor telepon"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                {errors.phone && (
                                    <div className="invalid-feedback">{errors.phone}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Poin</label>
                                <input
                                    type="number"
                                    name="point"
                                    className={`form-control ${errors.point ? 'is-invalid' : ''}`}
                                    placeholder="Masukkan jumlah poin (opsional)"
                                    min="0"
                                    value={formData.point}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                {errors.point && (
                                    <div className="invalid-feedback">{errors.point}</div>
                                )}
                                <small className="text-muted">Jika kosong, akan diatur ke 0</small>
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
                                ) : 'Simpan Pelanggan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCustomer;