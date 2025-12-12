import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { FaTrash, FaStar } from "react-icons/fa";

const AllReviews = () => {
    const queryClient = useQueryClient();

    // Fetch all reviews (Moderator)
    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ["allReviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/moderator/reviews");
            return res.data;
        },
    });

    // Delete review mutation
    const deleteMutation = useMutation({
        mutationFn: async (reviewId) => {
            const res = await axiosSecure.delete(`/reviews/${reviewId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allReviews"]);
            toast.success("Review deleted successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete review");
        },
    });

    const handleDelete = (review) => {
        if (
            window.confirm(
                `Are you sure you want to delete this review by ${review.userName}?`
            )
        ) {
            deleteMutation.mutate(review._id);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={star <= rating ? "text-[#a3e635]" : "text-gray-600"}
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
                All Reviews<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="mb-4 text-gray-400">
                Total Reviews: <span className="text-white font-bold">{reviews.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="card bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#a3e635]/30 transition-all"
                    >
                        <div className="card-body">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full ring ring-[#a3e635]/20">
                                        <img
                                            src={review.userImage || "https://via.placeholder.com/48"}
                                            alt={review.userName}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{review.userName}</h3>
                                    <p className="text-xs text-gray-500">{review.userEmail}</p>
                                </div>
                            </div>

                            {/* University */}
                            <div className="mb-3">
                                <p className="text-sm text-gray-400">University</p>
                                <p className="font-semibold text-white">{review.universityName}</p>
                            </div>

                            {/* Rating */}
                            <div className="mb-3">
                                <p className="text-sm text-gray-400 mb-1">Rating</p>
                                {renderStars(review.ratingPoint)}
                            </div>

                            {/* Comment */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-1">Comment</p>
                                <p className="text-gray-300 text-sm line-clamp-3">
                                    {review.reviewComment}
                                </p>
                            </div>

                            {/* Date */}
                            <div className="text-xs text-gray-500 mb-4">
                                Posted on {new Date(review.reviewDate).toLocaleDateString()}
                            </div>

                            {/* Actions */}
                            <div className="card-actions justify-end">
                                <button
                                    onClick={() => handleDelete(review)}
                                    disabled={deleteMutation.isPending}
                                    className="btn btn-sm btn-error btn-outline"
                                    title="Delete Review"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-xl">No reviews found</p>
                    <p className="text-gray-500 mt-2">Reviews will appear here once students post them</p>
                </div>
            )}
        </div>
    );
};

export default AllReviews;
