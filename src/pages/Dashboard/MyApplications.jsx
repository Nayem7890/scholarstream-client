import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useState, useContext } from "react";
import { FaEye, FaEdit, FaTrash, FaCreditCard, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

const MyApplications = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

    // Fetch my applications
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ["myApplications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/applications/me");
            return res.data;
        },
    });

    // Delete application mutation
    const deleteMutation = useMutation({
        mutationFn: async (applicationId) => {
            const res = await axiosSecure.delete(`/applications/${applicationId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["myApplications"]);
            toast.success("Application deleted successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete application");
        },
    });

    // Add review mutation
    const addReviewMutation = useMutation({
        mutationFn: async (reviewPayload) => {
            const res = await axiosSecure.post("/reviews", reviewPayload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["myApplications"]);
            queryClient.invalidateQueries(["myReviews"]);
            toast.success("Review added successfully!");
            setReviewData({ rating: 5, comment: "" });
            document.getElementById("review_modal")?.close();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to add review");
        },
    });

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        document.getElementById("details_modal").showModal();
    };

    const handleDelete = (application) => {
        if (window.confirm(`Are you sure you want to delete your application to ${application.universityName}?`)) {
            deleteMutation.mutate(application._id);
        }
    };

    const handleAddReview = (application) => {
        setSelectedApplication(application);
        setReviewData({ rating: 5, comment: "" });
        document.getElementById("review_modal").showModal();
    };

    const handleSubmitReview = () => {
        if (!selectedApplication) return;
        if (!reviewData.comment.trim()) {
            toast.error("Please write a review comment");
            return;
        }

        const reviewPayload = {
            scholarshipId: selectedApplication.scholarshipId,
            universityName: selectedApplication.universityName,
            userName: user?.displayName || "Anonymous",
            userEmail: user?.email,
            userImage: user?.photoURL || "https://via.placeholder.com/48",
            ratingPoint: reviewData.rating,
            reviewComment: reviewData.comment,
            reviewDate: new Date().toISOString(),
        };

        addReviewMutation.mutate(reviewPayload);
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

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`${star <= rating ? "text-[#a3e635]" : "text-gray-600"
                            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                        onClick={() => interactive && onChange && onChange(star)}
                    />
                ))}
            </div>
        );
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
                    <span>Error loading applications: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                My Applications<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="mb-4 text-gray-400">
                Total Applications: <span className="text-white font-bold">{applications.length}</span>
            </div>

            {applications.length === 0 ? (
                <div className="bg-[#111] rounded-[2rem] border border-white/5 p-12 text-center">
                    <p className="text-gray-400 text-lg mb-4">You haven't applied to any scholarships yet.</p>
                    <button
                        onClick={() => navigate("/all-scholarships")}
                        className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full"
                    >
                        Browse Scholarships
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                    <table className="table w-full">
                        <thead className="text-gray-400 border-b border-white/10">
                            <tr>
                                <th>#</th>
                                <th>University</th>
                                <th>Address</th>
                                <th>Feedback</th>
                                <th>Subject</th>
                                <th>Fees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {applications.map((app, index) => (
                                <tr
                                    key={app._id}
                                    className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                                >
                                    <th>{index + 1}</th>
                                    <td className="font-bold text-white">{app.universityName}</td>
                                    <td className="text-sm">
                                        {app.universityCity}, {app.universityCountry || "N/A"}
                                    </td>
                                    <td className="max-w-xs truncate text-sm">
                                        {app.feedback || <span className="text-gray-600">No feedback yet</span>}
                                    </td>
                                    <td>{app.subjectCategory || app.scholarshipCategory}</td>
                                    <td className="font-semibold text-white">${app.applicationFees}</td>
                                    <td>
                                        <div className={`badge ${getStatusBadge(app.applicationStatus)}`}>
                                            {app.applicationStatus}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-1 flex-wrap">
                                            {/* Details Button - Always visible */}
                                            <button
                                                onClick={() => handleViewDetails(app)}
                                                className="btn btn-xs bg-blue-500 text-white border-none hover:bg-blue-600"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>

                                            {/* Edit Button - Only if Pending */}
                                            {app.applicationStatus === "Pending" && (
                                                <button
                                                    onClick={() => toast.info("Edit functionality coming soon")}
                                                    className="btn btn-xs bg-purple-500 text-white border-none hover:bg-purple-600"
                                                    title="Edit Application"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {/* Pay Button - Only if Pending AND Unpaid */}
                                            {app.applicationStatus === "Pending" && app.paymentStatus === "unpaid" && (
                                                <button
                                                    onClick={() => navigate(`/payment/${app._id}`)}
                                                    className="btn btn-xs bg-green-500 text-white border-none hover:bg-green-600"
                                                    title="Pay Now"
                                                >
                                                    <FaCreditCard />
                                                </button>
                                            )}

                                            {/* Delete Button - Only if Pending */}
                                            {app.applicationStatus === "Pending" && (
                                                <button
                                                    onClick={() => handleDelete(app)}
                                                    disabled={deleteMutation.isPending}
                                                    className="btn btn-xs btn-error btn-outline"
                                                    title="Delete Application"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}

                                            {/* Add Review Button - Only if Completed */}
                                            {app.applicationStatus === "Completed" && (
                                                <button
                                                    onClick={() => handleAddReview(app)}
                                                    className="btn btn-xs bg-[#a3e635] text-black border-none hover:bg-lime-400"
                                                    title="Add Review"
                                                >
                                                    <FaStar />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Modal */}
            <dialog id="details_modal" className="modal">
                <div className="modal-box bg-[#111] border border-white/10 max-w-3xl">
                    <h3 className="font-bold text-2xl text-white mb-6">Application Details</h3>
                    {selectedApplication && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm">University</p>
                                    <p className="text-white font-semibold">{selectedApplication.universityName}</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm">Degree</p>
                                    <p className="text-white font-semibold">{selectedApplication.degree}</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm">Subject Category</p>
                                    <p className="text-white font-semibold">{selectedApplication.subjectCategory || selectedApplication.scholarshipCategory}</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm">Application Fees</p>
                                    <p className="text-white font-semibold">${selectedApplication.applicationFees}</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm">Application Status</p>
                                    <div className={`badge ${getStatusBadge(selectedApplication.applicationStatus)}`}>
                                        {selectedApplication.applicationStatus}
                                    </div>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm">Payment Status</p>
                                    <div className={`badge ${getPaymentBadge(selectedApplication.paymentStatus)}`}>
                                        {selectedApplication.paymentStatus}
                                    </div>
                                </div>
                            </div>

                            {selectedApplication.feedback && (
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm mb-2">Moderator Feedback</p>
                                    <p className="text-white">{selectedApplication.feedback}</p>
                                </div>
                            )}

                            <div className="modal-action">
                                <button
                                    onClick={() => document.getElementById("details_modal").close()}
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

            {/* Add Review Modal */}
            <dialog id="review_modal" className="modal">
                <div className="modal-box bg-[#111] border border-white/10 max-w-2xl">
                    <h3 className="font-bold text-2xl text-white mb-6">Add Review</h3>
                    {selectedApplication && (
                        <div className="space-y-6">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <p className="text-gray-400 text-sm">University</p>
                                <p className="text-white font-semibold text-lg">{selectedApplication.universityName}</p>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Rating *</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    {renderStars(reviewData.rating, true, (rating) =>
                                        setReviewData({ ...reviewData, rating })
                                    )}
                                    <span className="text-white font-semibold">{reviewData.rating} / 5</span>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Review Comment *</span>
                                </label>
                                <textarea
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    className="textarea textarea-bordered bg-black/30 text-white border-white/10 h-32"
                                    placeholder="Share your experience with this scholarship..."
                                    required
                                ></textarea>
                            </div>

                            <div className="modal-action">
                                <button
                                    onClick={() => {
                                        document.getElementById("review_modal").close();
                                        setReviewData({ rating: 5, comment: "" });
                                    }}
                                    className="btn btn-ghost text-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={addReviewMutation.isPending}
                                    className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none"
                                >
                                    {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
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

export default MyApplications;
