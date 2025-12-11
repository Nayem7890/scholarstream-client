// src/hooks/useRole.js
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthProvider";
import axiosSecure from "./useAxiosSecure"; // you already added this for JWT

const useRole = () => {
    const { user, loading } = useContext(AuthContext);

    const {
        data: roleData,
        isLoading: roleLoading,
    } = useQuery({
        enabled: !loading && !!user?.email,
        queryKey: ["userRole", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data.role; // "Admin" | "Moderator" | "Student"
        },
    });

    const role = roleData || "Student";
    const isAdmin = role === "Admin";
    const isModerator = role === "Moderator";

    return {
        role,
        isAdmin,
        isModerator,
        isRoleLoading: roleLoading || loading,
    };
};

export default useRole;
