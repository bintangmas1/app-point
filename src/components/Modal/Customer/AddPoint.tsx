// components/modals/AddPointsModal.tsx
import React, { useState, useEffect } from 'react';

interface AddPointsModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: { points: string; note: string }) => void;
    customerName?: string;
    loading?: boolean;
}

interface FormData {
    points: string;
    note: string;
}

const AddPointsModal: React.FC<AddPointsModalProps> = ({
    show,
    onClose,
    onSubmit,
    customerName = "",
    loading = false
}) => {
    const [formData, setFormData] = useState<FormData>({
        points: '',
        note: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (show) {
            setFormData({ points: '', note: '' });
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

    const validateForm = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};
        if (!formData.points.trim()) {
            newErrors.points = 'Jumlah poin harus diisi';
        } else if (parseInt(formData.points) < 1) {
            newErrors.points = 'Jumlah poin minimal 1';
        }
        if (!formData.note.trim()) {
            newErrors.note = 'Catatan harus diisi';
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
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData({ points: '', note: '' });
        setErrors({});
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Poin untuk {customerName}</h5>
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
                                <label className="form-label">Jumlah poin</label>
                                <input
                                    type="number"
                                    name="points"
                                    className={`form-control ${errors.points ? 'is-invalid' : ''}`}
                                    placeholder="Masukkan jumlah poin"
                                    min="1"
                                    value={formData.points}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                {errors.points && (
                                    <div className="invalid-feedback">{errors.points}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Catatan</label>
                                <textarea
                                    name="note"
                                    className={`form-control ${errors.note ? 'is-invalid' : ''}`}
                                    rows={3}
                                    placeholder="Tambahkan catatan..."
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                ></textarea>
                                {errors.note && (
                                    <div className="invalid-feedback">{errors.note}</div>
                                )}
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
                                ) : 'Tambah Poin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPointsModal;