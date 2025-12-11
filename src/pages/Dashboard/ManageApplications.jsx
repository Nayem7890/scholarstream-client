import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaEye, FaCheck, FaTimes, FaEdit } from "react-icons/fa";

const ManageApplications = () => {
    const queryClient = useQueryClient();
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Fetch all applications
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ["allApplications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/applications");
            return res.data.data || res.data; // Handle both formats
        },
    });

    // Update application status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, feedback }) => {
            const res = await axiosSecure.patch(`/applications/${id}/status`, {
                status,
                feedback,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allApplications"]);
            toast.success("Application status updated successfully!");
            setSelectedApplication(null);
            setFeedback("");
            document.getElementById("details_modal")?.close();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update application");
        },
    });

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setFeedback(application.feedback || "");
        document.getElementById("details_modal").showModal();
    };

    const handleFeedbackModal = (application) => {
        setSelectedApplication(application);
        setFeedback(application.feedback || "");
        document.getElementById("feedback_modal").showModal();
    };

    const handleUpdateStatus = (status) => {
        if (!selectedApplication) return;

        updateStatusMutation.mutate({
            id: selectedApplication._id,
            status,
            feedback,
        });
    };

    const handleSaveFeedback = () => {
        if (!selectedApplication) return;

        updateStatusMutation.mutate({
            id: selectedApplication._id,
            status: selectedApplication.applicationStatus,
            feedback,
        });
        document.getElementById("feedback_modal")?.close();
    };

    const getStatusBadge = (status) => {
        const badges = {
            Pending: "badge-warning",
            Processing: "badge-info",
            Completed: "badge-success",
            Rejected: "badge-error",
        };
        return badges[status] || "badge-ghost";
    };

    const getPaymentBadge = (status) => {
        return status === "paid" ? "badge-success" : "badge-error";
    };

    // Filter applications
    const filteredApplications = applications.filter((app) => {
        if (filterStatus === "all") return true;
        return app.applicationStatus === filterStatus;
    });

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
                    <span>Error loading applications: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                Manage Applications<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="mb-4 text-gray-400">
                Total Applications: <span className="text-white font-bold">{applications.length}</span>
                {filterStatus !== "all" && (
                    <span className="ml-2">
                        | Showing: <span className="text-[#a3e635] font-bold">{filteredApplications.length}</span>
                    </span>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="tabs tabs-boxed bg-[#111] border border-white/5 mb-6 p-1">
                <a
                    className={`tab ${filterStatus === "all" ? "tab-active" : ""}`}
                    onClick={() => setFilterStatus("all")}
                >
                    All
                </a>
                <a
                    className={`tab ${filterStatus === "Pending" ? "tab-active" : ""}`}
                    onClick={() => setFilterStatus("Pending")}
                >
                    Pending
                </a>
                <a
                    className={`tab ${filterStatus === "Processing" ? "tab-active" : ""}`}
                    onClick={() => setFilterStatus("Processing")}
                >
                    Processing
                </a>
                <a
                    className={`tab ${filterStatus === "Completed" ? "tab-active" : ""}`}
                    onClick={() => setFilterStatus("Completed")}
                >
                    Completed
                </a>
                <a
                    className={`tab ${filterStatus === "Rejected" ? "tab-active" : ""}`}
                    onClick={() => setFilterStatus("Rejected")}
                >
                    Rejected
                </a>
            </div>

            <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                <table className="table w-full">
                    <thead className="text-gray-400 border-b border-white/10">
                        <tr>
                            <th>#</th>
                            <th>Applicant</th>
                            <th>University</th>
                            <th>Degree</th>
                            <th>Fees</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {filteredApplications.map((application, index) => (
                            <tr
                                key={application._id}
                                className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                            >
                                <th>{index + 1}</th>
                                <td>
                                    <div>
                                        <div className="font-bold text-white">{application.userName}</div>
                                        <div className="text-xs text-gray-500">{application.userEmail}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-semibold text-white">{application.universityName}</div>
                                    <div className="text-xs text-gray-500">{application.scholarshipCategory}</div>
                                </td>
                                <td>{application.degree}</td>
                                <td className="text-white font-semibold">${application.applicationFees}</td>
                                <td>
                                    <div className={`badge ${getPaymentBadge(application.paymentStatus)}`}>
                                        {application.paymentStatus}
                                    </div>
                                </td>
                                <td>
                                    <div className={`badge ${getStatusBadge(application.applicationStatus)}`}>
                                        {application.applicationStatus}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewDetails(application)}
                                            className="btn btn-xs bg-blue-500 text-white border-none hover:bg-blue-600"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleFeedbackModal(application)}
                                            className="btn btn-xs bg-purple-500 text-white border-none hover:bg-purple-600"
                                            title="Add Feedback"
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredApplications.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No applications found for this filter.
                </div>
            )}

            {/* Details Modal */}
            <dialog id="details_modal" className="modal">
                <div className="modal-box bg-[#111] border border-white/10 max-w-3xl">
                    <h3 className="font-bold text-2xl text-white mb-6">Application Details</h3>
                    {selectedApplication && (
                        <div className="space-y-6">
                            {/* Applicant Info */}
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <h4 className="text-lg font-bold text-white mb-3">Applicant Information</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="text-white font-semibold">{selectedApplication.userName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="text-white font-semibold">{selectedApplication.userEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">User ID</p>
                                        <p className="text-white font-semibold">{selectedApplication.userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Application Date</p>
                                        <p className="text-white font-semibold">
                                            {new Date(selectedApplication.applicationDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Info */}
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <h4 className="text-lg font-bold text-white mb-3">Scholarship Information</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">University</p>
                                        <p className="text-white font-semibold">{selectedApplication.universityName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Degree</p>
                                        <p className="text-white font-semibold">{selectedApplication.degree}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Category</p>
                                        <p className="text-white font-semibold">{selectedApplication.scholarshipCategory}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Scholarship ID</p>
                                        <p className="text-white font-semibold text-xs">{selectedApplication.scholarshipId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Fees */}
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <h4 className="text-lg font-bold text-white mb-3">Payment Information</h4>
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Application Fees</p>
                                        <p className="text-white font-semibold">${selectedApplication.applicationFees}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Service Charge</p>
                                        <p className="text-white font-semibold">${selectedApplication.serviceCharge}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Payment Status</p>
                                        <div className={`badge ${getPaymentBadge(selectedApplication.paymentStatus)}`}>
                                            {selectedApplication.paymentStatus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Application Status */}
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <h4 className="text-lg font-bold text-white mb-3">Application Status</h4>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-gray-400">Current Status:</span>
                                    <div className={`badge badge-lg ${getStatusBadge(selectedApplication.applicationStatus)}`}>
                                        {selectedApplication.applicationStatus}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleUpdateStatus("Processing")}
                                        disabled={updateStatusMutation.isPending || selectedApplication.applicationStatus === "Processing"}
                                        className="btn btn-sm bg-blue-500 text-white border-none hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        <FaCheck /> Mark as Processing
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus("Completed")}
                                        disabled={updateStatusMutation.isPending || selectedApplication.applicationStatus === "Completed"}
                                        className="btn btn-sm bg-green-500 text-white border-none hover:bg-green-600 disabled:opacity-50"
                                    >
                                        <FaCheck /> Mark as Completed
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus("Rejected")}
                                        disabled={updateStatusMutation.isPending || selectedApplication.applicationStatus === "Rejected"}
                                        className="btn btn-sm btn-error disabled:opacity-50"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                </div>
                            </div>

                            {/* Feedback Display */}
                            {selectedApplication.feedback && (
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <h4 className="text-lg font-bold text-white mb-3">Current Feedback</h4>
                                    <p className="text-gray-300">{selectedApplication.feedback}</p>
                                </div>
                            )}

                            <div className="modal-action">
                                <button
                                    onClick={() => {
                                        document.getElementById("details_modal").close();
                                        setSelectedApplication(null);
                                        setFeedback("");
                                    }}
                                    className="btn btn-ghost text-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Feedback Modal */}
            <dialog id="feedback_modal" className="modal">
                <div className="modal-box bg-[#111] border border-white/10 max-w-2xl">
                    <h3 className="font-bold text-2xl text-white mb-6">Add/Edit Feedback</h3>
                    {selectedApplication && (
                        <div className="space-y-4">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <p className="text-gray-400 text-sm">Applicant</p>
                                <p className="text-white font-semibold">{selectedApplication.userName}</p>
                                <p className="text-gray-500 text-xs">{selectedApplication.userEmail}</p>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Moderator Feedback</span>
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="textarea textarea-bordered bg-black/30 text-white border-white/10 h-32"
                                    placeholder="Provide detailed feedback for the applicant..."
                                ></textarea>
                            </div>

                            <div className="modal-action">
                                <button
                                    onClick={() => {
                                        document.getElementById("feedback_modal").close();
                                        setFeedback("");
                                    }}
                                    className="btn btn-ghost text-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveFeedback}
                                    disabled={updateStatusMutation.isPending}
                                    className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none"
                                >
                                    {updateStatusMutation.isPending ? "Saving..." : "Save Feedback"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ManageApplications;
