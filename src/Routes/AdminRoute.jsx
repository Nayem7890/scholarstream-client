// src/Routes/AdminRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const { isAdmin, isRoleLoading } = useRole();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (user && isAdmin) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
