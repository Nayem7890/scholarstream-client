import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const ManageScholarships = () => {
    const queryClient = useQueryClient();
    const [editingScholarship, setEditingScholarship] = useState(null);

    // Fetch all scholarships
    const { data: scholarships = [], isLoading, error } = useQuery({
        queryKey: ["allScholarships"],
        queryFn: async () => {
            const res = await axiosSecure.get("/scholarships");
            return res.data.data || res.data; // Handle both formats
        },
    });

    // Delete scholarship mutation
    const deleteMutation = useMutation({
        mutationFn: async (scholarshipId) => {
            const res = await axiosSecure.delete(`/scholarships/${scholarshipId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allScholarships"]);
            toast.success("Scholarship deleted successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete scholarship");
        },
    });

    // Update scholarship mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await axiosSecure.patch(`/scholarships/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allScholarships"]);
            toast.success("Scholarship updated successfully!");
            setEditingScholarship(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update scholarship");
        },
    });

    const handleDelete = (scholarship) => {
        if (window.confirm(`Are you sure you want to delete "${scholarship.scholarshipName}"?`)) {
            deleteMutation.mutate(scholarship._id);
        }
    };

    const handleEdit = (scholarship) => {
        setEditingScholarship(scholarship);
        document.getElementById("edit_modal").showModal();
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            scholarshipName: formData.get("scholarshipName"),
            universityName: formData.get("universityName"),
            subjectCategory: formData.get("subjectCategory"),
            degree: formData.get("degree"),
            applicationFees: parseFloat(formData.get("applicationFees")),
            serviceCharge: parseFloat(formData.get("serviceCharge")),
            universityCountry: formData.get("universityCountry"),
            universityCity: formData.get("universityCity"),
            universityWorldRank: parseInt(formData.get("universityWorldRank")),
        };
        updateMutation.mutate({ id: editingScholarship._id, data });
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
            <div className="max-w-6xl mx-auto">
                <div className="alert alert-error">
                    <span>Error loading scholarships: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                Manage Scholarships<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="mb-4 text-gray-400">
                Total Scholarships: <span className="text-white font-bold">{scholarships.length}</span>
            </div>

            <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                <table className="table w-full">
                    <thead className="text-gray-400 border-b border-white/10">
                        <tr>
                            <th>#</th>
                            <th>Scholarship</th>
                            <th>University</th>
                            <th>Category</th>
                            <th>Fees</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {scholarships.map((scholarship, index) => (
                            <tr
                                key={scholarship._id}
                                className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                            >
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-lg ring ring-[#a3e635]/20">
                                                <img
                                                    src={scholarship.universityImage || "https://via.placeholder.com/48"}
                                                    alt={scholarship.universityName}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{scholarship.scholarshipName}</div>
                                            <div className="text-xs text-gray-500">{scholarship.degree}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>{scholarship.universityName}</div>
                                    <div className="text-xs text-gray-500">
                                        {scholarship.universityCity}, {scholarship.universityCountry}
                                    </div>
                                </td>
                                <td>
                                    <div className="badge badge-outline border-[#a3e635] text-[#a3e635]">
                                        {scholarship.subjectCategory}
                                    </div>
                                </td>
                                <td className="text-white font-semibold">${scholarship.applicationFees}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/scholarship/${scholarship._id}`}
                                            className="btn btn-xs bg-blue-500 text-white border-none hover:bg-blue-600"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(scholarship)}
                                            disabled={updateMutation.isPending}
                                            className="btn btn-xs bg-[#a3e635] text-black border-none hover:bg-lime-400"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(scholarship)}
                                            disabled={deleteMutation.isPending}
                                            className="btn btn-xs btn-error btn-outline"
                                            title="Delete"
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

            {scholarships.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No scholarships found. Add your first scholarship!
                </div>
            )}

            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box bg-[#111] border border-white/10 max-w-2xl">
                    <h3 className="font-bold text-2xl text-white mb-6">Edit Scholarship</h3>
                    {editingScholarship && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">Scholarship Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="scholarshipName"
                                        defaultValue={editingScholarship.scholarshipName}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">University Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="universityName"
                                        defaultValue={editingScholarship.universityName}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">Subject Category</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subjectCategory"
                                        defaultValue={editingScholarship.subjectCategory}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">Degree</span>
                                    </label>
                                    <select
                                        name="degree"
                                        defaultValue={editingScholarship.degree}
                                        className="select select-bordered bg-black/30 text-white border-white/10"
                                        required
                                    >
                                        <option>Bachelor</option>
                                        <option>Master</option>
                                        <option>PhD</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">Application Fees ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="applicationFees"
                                        defaultValue={editingScholarship.applicationFees}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">Service Charge ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="serviceCharge"
                                        defaultValue={editingScholarship.serviceCharge}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">Country</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="universityCountry"
                                        defaultValue={editingScholarship.universityCountry}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-400">City</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="universityCity"
                                        defaultValue={editingScholarship.universityCity}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                    />
                                </div>
                                <div className="form-control col-span-2">
                                    <label className="label">
                                        <span className="label-text text-gray-400">World Rank</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="universityWorldRank"
                                        defaultValue={editingScholarship.universityWorldRank}
                                        className="input input-bordered bg-black/30 text-white border-white/10"
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("edit_modal").close()}
                                    className="btn btn-ghost text-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none"
                                >
                                    {updateMutation.isPending ? "Updating..." : "Update Scholarship"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ManageScholarships;
