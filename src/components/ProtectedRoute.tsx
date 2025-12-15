// components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentAdmin } from "../service/Auth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const admin = getCurrentAdmin();
            if (!admin) {
                navigate("/");
            }
        };

        checkAuth();
    }, [navigate]);

    const admin = getCurrentAdmin();

    if (admin === null) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return children;
};

export default ProtectedRoute;