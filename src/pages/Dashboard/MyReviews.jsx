import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";

const MyReviews = () => {
    const queryClient = useQueryClient();
    const [editingReview, setEditingReview] = useState(null);
    const [editData, setEditData] = useState({ rating: 5, comment: "" });

    // Fetch my reviews
    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ["myReviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/reviews/me");
            return res.data;
        },
    });

    // Update review mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await axiosSecure.patch(`/reviews/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["myReviews"]);
            toast.success("Review updated successfully!");
            setEditingReview(null);
            document.getElementById("edit_modal")?.close();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update review");
        },
    });

    // Delete review mutation
    const deleteMutation = useMutation({
        mutationFn: async (reviewId) => {
            const res = await axiosSecure.delete(`/reviews/${reviewId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["myReviews"]);
            toast.success("Review deleted successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete review");
        },
    });

    const handleEdit = (review) => {
        setEditingReview(review);
        setEditData({
            rating: review.ratingPoint,
            comment: review.reviewComment,
        });
        document.getElementById("edit_modal").showModal();
    };

    const handleUpdate = () => {
        if (!editingReview) return;
        if (!editData.comment.trim()) {
            toast.error("Please write a review comment");
            return;
        }

        updateMutation.mutate({
            id: editingReview._id,
            data: {
                ratingPoint: editData.rating,
                reviewComment: editData.comment,
            },
        });
    };

    const handleDelete = (review) => {
        if (
            window.confirm(
                `Are you sure you want to delete your review for ${review.universityName}?`
            )
        ) {
            deleteMutation.mutate(review._id);
        }
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
                    <span>Error loading reviews: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                My Reviews<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="mb-4 text-gray-400">
                Total Reviews: <span className="text-white font-bold">{reviews.length}</span>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-[#111] rounded-[2rem] border border-white/5 p-12 text-center">
                    <p className="text-gray-400 text-lg mb-4">
                        You haven't written any reviews yet.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Complete your scholarship applications to add reviews!
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                    <table className="table w-full">
                        <thead className="text-gray-400 border-b border-white/10">
                            <tr>
                                <th>#</th>
                                <th>Scholarship</th>
                                <th>University</th>
                                <th>Review Comment</th>
                                <th>Review Date</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {reviews.map((review, index) => (
                                <tr
                                    key={review._id}
                                    className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                                >
                                    <th>{index + 1}</th>
                                    <td className="font-semibold text-white">
                                        {review.scholarshipName || "N/A"}
                                    </td>
                                    <td>{review.universityName}</td>
                                    <td className="max-w-md">
                                        <p className="line-clamp-2">{review.reviewComment}</p>
                                    </td>
                                    <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                                    <td>{renderStars(review.ratingPoint)}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(review)}
                                                disabled={updateMutation.isPending}
                                                className="btn btn-xs bg-purple-500 text-white border-none hover:bg-purple-600"
                                                title="Edit Review"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review)}
                                                disabled={deleteMutation.isPending}
                                                className="btn btn-xs btn-error btn-outline"
                                                title="Delete Review"
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
            )}

            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box bg-[#111] border border-white/10 max-w-2xl">
                    <h3 className="font-bold text-2xl text-white mb-6">Edit Review</h3>
                    {editingReview && (
                        <div className="space-y-6">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <p className="text-gray-400 text-sm">University</p>
                                <p className="text-white font-semibold text-lg">
                                    {editingReview.universityName}
                                </p>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Rating *</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    {renderStars(editData.rating, true, (rating) =>
                                        setEditData({ ...editData, rating })
                                    )}
                                    <span className="text-white font-semibold">
                                        {editData.rating} / 5
                                    </span>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">
                                        Review Comment *
                                    </span>
                                </label>
                                <textarea
                                    value={editData.comment}
                                    onChange={(e) =>
                                        setEditData({ ...editData, comment: e.target.value })
                                    }
                                    className="textarea textarea-bordered bg-black/30 text-white border-white/10 h-32"
                                    placeholder="Share your experience with this scholarship..."
                                    required
                                ></textarea>
                            </div>

                            <div className="modal-action">
                                <button
                                    onClick={() => {
                                        document.getElementById("edit_modal").close();
                                        setEditingReview(null);
                                    }}
                                    className="btn btn-ghost text-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updateMutation.isPending}
                                    className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none"
                                >
                                    {updateMutation.isPending ? "Updating..." : "Update Review"}
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

export default MyReviews;
