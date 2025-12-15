// components/modals/EditCustomerModal.tsx
import React, { useState, useEffect } from 'react';

interface CustomerData {
    id: string;
    name: string;
    address: string;
    phone: string;
    point: number;
    status: boolean;
    created_at: string;
}

interface EditCustomerModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<CustomerData, 'id' | 'created_at' | 'point'>) => void;
    customer?: CustomerData | null;
    loading?: boolean;
}

interface FormData {
    name: string;
    address: string;
    phone: string;
    status: boolean;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
    show,
    onClose,
    onSubmit,
    customer = null,
    loading = false
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        address: '',
        phone: '',
        status: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (customer && show) {
            setFormData({
                name: customer.name || '',
                address: customer.address || '',
                phone: customer.phone || '',
                status: customer.status ?? true
            });
        } else if (show) {
            setFormData({
                name: '',
                address: '',
                phone: '',
                status: true
            });
        }
        setErrors({});
    }, [customer, show]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: checkbox.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Nama customer harus diisi';
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
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            status: formData.status
        });
    };

    const handleClose = () => {
        setFormData({
            name: '',
            address: '',
            phone: '',
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
                        <h5 className="modal-title">Ubah Data Customer</h5>
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
                                <label className="form-label">Nama Customer</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
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
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">No. Telepon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    name="status"
                                    className="form-check-input"
                                    checked={formData.status}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                <label className="form-check-label">Aktif</label>
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

export default EditCustomerModal;