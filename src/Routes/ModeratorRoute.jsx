// src/Routes/ModeratorRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import useRole from "../hooks/useRole";

const ModeratorRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const { isModerator, isRoleLoading } = useRole();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (user && isModerator) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default ModeratorRoute;
