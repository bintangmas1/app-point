// components/Profil/ProfilData.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateWorker, useWorkers } from "../../hooks/useWorkers";
import { getCurrentAdmin } from "../../service/Auth";
import { supabase } from "../../utils/supabase/client";
import { showNotification } from "../../utils/notification";

const Profile = () => {
    const navigate = useNavigate();
    const currentAdminSession = getCurrentAdmin();
    const { data, loading, error } = useWorkers({
        id: currentAdminSession?.id
    });
    const admin = data && data.length > 0 ? data[0] : null;
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editData, setEditData] = useState({ name: '', username: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (admin) {
            setEditData({ name: admin.name || '', username: admin.username || '' });
        }
    }, [admin?.id, admin?.name, admin?.username]);

    useEffect(() => {
        if (currentAdminSession?.id === undefined) {
            navigate("/");
        }
    }, [currentAdminSession?.id, navigate]);

    const handleBack = () => {
        navigate("/home");
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (admin) {
            setEditData({
                name: admin.name || '',
                username: admin.username || ''
            });
        }
    };

    const handleSave = async () => {
        try {
            if (!admin?.id) {
                showNotification('Data admin tidak valid', "error");
                return;
            }

            const { data: updatedData, error: updateError } = await updateWorker(admin.id, {
                name: editData.name,
                username: editData.username
            });

            if (updateError) {
                showNotification('Gagal menyimpan profil: ' + updateError, "error");
                return;
            }

            const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
            const updatedSession = {
                ...session,
                name: editData.name,
                username: editData.username
            };
            localStorage.setItem('adminSession', JSON.stringify(updatedSession));

            setIsEditing(false);
            showNotification('Profil berhasil diperbarui!', "success");

            window.location.reload();

        } catch (error) {
            showNotification('Terjadi kesalahan saat menyimpan profil', "error");
        }
    };

    const handlePasswordChange = () => {
        setIsChangingPassword(true);
    };

    const handleCancelPasswordChange = () => {
        setIsChangingPassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleSavePassword = async () => {
        try {
            // Validasi input
            if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                showNotification('Semua field password harus diisi', "error");
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                showNotification('Password baru dan konfirmasi password tidak cocok', "error");
                return;
            }

            if (passwordData.newPassword.length < 6) {
                showNotification('Password baru minimal 6 karakter', "error");
                return;
            }

            if (!admin) {
                showNotification('Data admin tidak ditemukan', "error");
                return;
            }

            // Cek password saat ini (untuk keamanan)
            const { data: currentAdmin, error: checkError } = await supabase
                .from("admins")
                .select("*")
                .eq("id", admin.id)
                .eq("password", passwordData.currentPassword) // Cek password saat ini
                .single();

            if (checkError || !currentAdmin) {
                showNotification('Password saat ini salah', "error");
                return;
            }

            const { error: passwordError } = await updateWorker(admin.id, {
                password: passwordData.newPassword
            });

            if (passwordError) {
                alert();
                showNotification('Gagal mengubah password: ' + passwordError, "error");
                return;
            }

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsChangingPassword(false);
            showNotification('Password berhasil diubah!', "success");

        } catch (error) {
            showNotification('Terjadi kesalahan saat mengubah password', "error");
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <p>Error: {error}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/home")}>
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (currentAdminSession?.id === undefined) {
        return null;
    }

    if (!admin) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <p>Data profil tidak ditemukan.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/home")}>
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content-wrapper py-3">
            <div className="container">
                <div className="row justify-content-center">
                    {/* Informasi Profil */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-person-circle"></i> Informasi Profil
                                </h5>
                                {!isEditing && (
                                    <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}>
                                        <i className="bi bi-pencil"></i> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            {isEditing ? (
                                // Form Edit
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editData.username}
                                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary" onClick={handleSave}>
                                            <i className="bi bi-save"></i> Simpan
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                            <i className="bi bi-x"></i> Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="text-muted">Nama</span>
                                            <strong style={{ fontSize: '16px' }}>{admin?.name}</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="text-muted">Username</span>
                                            <small className="text-end" style={{ maxWidth: "70%", fontSize: '16px' }}>
                                                {admin?.username || '-'}
                                            </small>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="text-muted">Status</span>
                                            <span style={{ fontSize: '16px' }} className={`badge ${admin?.status
                                                ? 'bg-success'
                                                : 'bg-danger'
                                                }`} >
                                                {admin?.status ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span className="text-muted">Jenis Akun</span>
                                            <span style={{ fontSize: '16px' }} className={`badge ${admin?.is_super_admin
                                                ? 'bg-primary'
                                                : 'bg-warning'
                                                }`} >
                                                {admin?.is_super_admin ? 'Super Admin' : 'Pegawai'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ubah Password */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-key"></i> Ubah Password
                                </h5>
                                {!isChangingPassword && (
                                    <button
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={handlePasswordChange}
                                    >
                                        <i className="bi bi-pencil"></i> Ubah Password
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            {isChangingPassword ? (
                                // Form Ubah Password
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label">Password Saat Ini</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="Masukkan password saat ini"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Password Baru</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Minimal 6 karakter"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="Ulangi password baru"
                                        />
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-warning" onClick={handleSavePassword}>
                                            <i className="bi bi-save"></i> Simpan Password
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleCancelPasswordChange}>
                                            <i className="bi bi-x"></i> Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div>
                                    <p className="mb-0">
                                        <i className="bi bi-info-circle"></i> Klik tombol "Ubah Password" untuk mengganti password Anda.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Keamanan */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-shield-lock"></i> Keamanan
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-2">
                                <strong>Sesi Login Saat Ini</strong>
                            </p>
                            <p className="text-muted small">
                                Sesi ini akan berakhir dalam 24 jam setelah login terakhir.
                            </p>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                    if (window.confirm('Apakah Anda yakin ingin logout?')) {
                                        localStorage.removeItem('adminSession');
                                        navigate("/");
                                    }
                                }}
                            >
                                <i className="bi bi-box-arrow-right"></i> Logout dari Sesi Ini
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;