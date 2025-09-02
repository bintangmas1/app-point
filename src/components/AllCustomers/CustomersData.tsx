import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCustomer, useCustomers } from "../../hooks/useCustomers";
import { getCurrentAdmin } from "../../service/Auth";
import AddCustomer from "../Modal/Customer/AddData";
import { showNotification } from "../../utils/notification";

const CustomersData = () => {
    const {
        data: AllCustomers,
        loading,
        error,
        refetch,
    } = useCustomers({
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

    const filteredAndSortedItems = useMemo(() => {
        return AllCustomers.filter((item) => {
            const nameMatch = item.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const alamatMatch =
                item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
            const phoneMatch =
                item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
            return nameMatch || alamatMatch || phoneMatch;
        });
    }, [AllCustomers, searchTerm]);

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
                        <h6 className="mb-0">Semua Pelanggan</h6>
                        <small className="text-muted">Daftar semua pelanggan toko</small>
                    </div>
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
                </div>

                <div className="mb-3">
                    <div className="form-group mb-0">
                        <input
                            type="text"
                            id="elementsSearchInput"
                            placeholder="Cari pelanggan..."
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
                            to={`/customer/detail/${item.id}`}
                            className={`affan-element-item d-flex align-items-center justify-content-between text-decoration-none `}
                        >
                            <div className="d-flex align-items-center">
                                <span
                                    className="text-white fw-bold bg-primary rounded-circle d-flex align-items-center justify-content-center text-white"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        minWidth: "auto",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item.point}
                                </span>
                            </div>

                            <div className="flex-fill ms-4">
                                <strong>{item.name}</strong>
                                <br />
                                <small className="text-muted">{item.address}</small>
                                <br />
                                <small className="text-muted">{item.phone}</small>
                            </div>

                            <span
                                className={`badge ms-2 ${item.status ? "bg-success" : "bg-danger"
                                    }`}
                                style={{ fontSize: "0.75em" }}
                                title={item.status ? "Pelanggan Aktif" : "Pelanggan Non-Aktif"}
                            >
                                {item.status ? (
                                    <>
                                        <i className="bi bi-check-circle me-1"></i>
                                        Aktif
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-x-circle me-1"></i>
                                        Non-Aktif
                                    </>
                                )}
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
