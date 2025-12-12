import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { FaTrash, FaUserShield, FaUserTie } from "react-icons/fa";

const ManageUsers = () => {
    const queryClient = useQueryClient();

    // Fetch all users
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data.data || res.data; // Handle both formats
        },
    });

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            const res = await axiosSecure.delete(`/users/${userId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allUsers"]);
            toast.success("User deleted successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });

    // Update user role
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const res = await axiosSecure.patch(`/users/${userId}/role`, { role });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allUsers"]);
            toast.success("User role updated successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update role");
        },
    });

    const handleDelete = (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            deleteMutation.mutate(userId);
        }
    };

    const handleMakeAdmin = (userId, userName) => {
        if (window.confirm(`Make ${userName} an Admin?`)) {
            updateRoleMutation.mutate({ userId, role: "Admin" });
        }
    };

    const handleMakeModerator = (userId, userName) => {
        if (window.confirm(`Make ${userName} a Moderator?`)) {
            updateRoleMutation.mutate({ userId, role: "Moderator" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-[#a3e635]"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="alert alert-error">
                    <span>Error loading users: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                Manage Users<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="mb-4 text-gray-400">
                Total Users: <span className="text-white font-bold">{users.length}</span>
            </div>

            <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                <table className="table w-full">
                    <thead className="text-gray-400 border-b border-white/10">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {users.map((user, index) => (
                            <tr
                                key={user._id}
                                className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                            >
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-10 h-10 rounded-full ring ring-[#a3e635]/20">
                                                <img
                                                    src={user.photoURL || "https://via.placeholder.com/40"}
                                                    alt={user.name}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-bold text-white">{user.name}</div>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <div
                                        className={`badge badge-outline ${user.role === "Admin"
                                            ? "border-[#a3e635] text-[#a3e635]"
                                            : user.role === "Moderator"
                                                ? "border-blue-400 text-blue-400"
                                                : "border-white/20 text-gray-300"
                                            }`}
                                    >
                                        {user.role || "Student"}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {user.role !== "Admin" && (
                                            <button
                                                onClick={() => handleMakeAdmin(user._id, user.name)}
                                                disabled={updateRoleMutation.isPending}
                                                className="btn btn-xs bg-[#a3e635] text-black border-none hover:bg-lime-400 disabled:bg-gray-600"
                                                title="Make Admin"
                                            >
                                                <FaUserShield /> Admin
                                            </button>
                                        )}
                                        {user.role !== "Moderator" && user.role !== "Admin" && (
                                            <button
                                                onClick={() => handleMakeModerator(user._id, user.name)}
                                                disabled={updateRoleMutation.isPending}
                                                className="btn btn-xs bg-blue-500 text-white border-none hover:bg-blue-600 disabled:bg-gray-600"
                                                title="Make Moderator"
                                            >
                                                <FaUserTie /> Mod
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user._id, user.name)}
                                            disabled={deleteMutation.isPending}
                                            className="btn btn-xs btn-error btn-outline disabled:bg-gray-600"
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No users found in the system.
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
