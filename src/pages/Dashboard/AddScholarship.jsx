import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AddScholarship = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const createMutation = useMutation({
        mutationFn: async (scholarshipData) => {
            const res = await axiosSecure.post("/scholarships", scholarshipData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allScholarships"]);
            toast.success("Scholarship created successfully!");
            navigate("/dashboard/manage-scholarships");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create scholarship");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const scholarshipData = {
            scholarshipName: formData.get("scholarshipName"),
            universityName: formData.get("universityName"),
            universityImage: formData.get("universityImage"),
            universityCountry: formData.get("universityCountry"),
            universityCity: formData.get("universityCity"),
            universityWorldRank: parseInt(formData.get("universityWorldRank")),
            subjectCategory: formData.get("subjectCategory"),
            scholarshipCategory: formData.get("scholarshipCategory"),
            degree: formData.get("degree"),
            tuitionFees: parseFloat(formData.get("tuitionFees")),
            applicationFees: parseFloat(formData.get("applicationFees")),
            serviceCharge: parseFloat(formData.get("serviceCharge")),
            applicationDeadline: formData.get("applicationDeadline"),
            scholarshipPostDate: new Date().toISOString(),
            postedBy: {
                name: user?.displayName || "Admin",
                email: user?.email,
            },
        };

        createMutation.mutate(scholarshipData);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                Add New Scholarship<span className="text-[#a3e635]">.</span>
            </h2>

            <div className="bg-[#111] rounded-[2rem] border border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Scholarship Information */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white mb-4">Scholarship Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Scholarship Name *</span>
                                </label>
                                <input
                                    type="text"
                                    name="scholarshipName"
                                    placeholder="e.g., Merit-Based Scholarship"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Subject Category *</span>
                                </label>
                                <select
                                    name="subjectCategory"
                                    className="select select-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option>Engineering</option>
                                    <option>Computer Science</option>
                                    <option>Business</option>
                                    <option>Medicine</option>
                                    <option>Arts</option>
                                    <option>Science</option>
                                    <option>Law</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Scholarship Category *</span>
                                </label>
                                <select
                                    name="scholarshipCategory"
                                    className="select select-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option>Full fund</option>
                                    <option>Partial fund</option>
                                    <option>Self fund</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Degree *</span>
                                </label>
                                <select
                                    name="degree"
                                    className="select select-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                >
                                    <option value="">Select Degree</option>
                                    <option>Bachelor</option>
                                    <option>Master</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* University Information */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white mb-4">University Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">University Name *</span>
                                </label>
                                <input
                                    type="text"
                                    name="universityName"
                                    placeholder="e.g., Harvard University"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">University Image URL *</span>
                                </label>
                                <input
                                    type="url"
                                    name="universityImage"
                                    placeholder="https://example.com/image.jpg"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Country *</span>
                                </label>
                                <input
                                    type="text"
                                    name="universityCountry"
                                    placeholder="e.g., USA"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">City *</span>
                                </label>
                                <input
                                    type="text"
                                    name="universityCity"
                                    placeholder="e.g., Cambridge"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                />
                            </div>

                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text text-gray-400">World Rank *</span>
                                </label>
                                <input
                                    type="number"
                                    name="universityWorldRank"
                                    placeholder="e.g., 1"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial*/}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white mb-4">Financial Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Tuition Fees ($) *</span>
                                </label>
                                <input
                                    type="number"
                                    name="tuitionFees"
                                    placeholder="e.g., 50000"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Application Fees ($) *</span>
                                </label>
                                <input
                                    type="number"
                                    name="applicationFees"
                                    placeholder="e.g., 50"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-400">Service Charge ($) *</span>
                                </label>
                                <input
                                    type="number"
                                    name="serviceCharge"
                                    placeholder="e.g., 10"
                                    className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-400">Application Deadline *</span>
                        </label>
                        <input
                            type="date"
                            name="applicationDeadline"
                            className="input input-bordered bg-black/30 text-white border-white/10 focus:border-[#a3e635]"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/manage-scholarships")}
                            className="btn btn-ghost text-gray-400 flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none flex-1"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create Scholarship"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddScholarship;
