import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import { FaUsers, FaBook, FaMoneyBillWave, FaFileAlt } from "react-icons/fa";

const Analytics = () => {
    // Fetch analytics data
    const { data: analytics = {}, isLoading, error } = useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const res = await axiosSecure.get("/analytics");
            return res.data.data || res.data; // Handle both formats
        },
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
                    <span>Error loading analytics: {error.message}</span>
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Users",
            value: analytics.totalUsers || 0,
            icon: <FaUsers className="text-4xl" />,
            color: "bg-blue-500",
            textColor: "text-blue-500",
        },
        {
            title: "Total Scholarships",
            value: analytics.totalScholarships || 0,
            icon: <FaBook className="text-4xl" />,
            color: "bg-[#a3e635]",
            textColor: "text-[#a3e635]",
        },
        {
            title: "Total Applications",
            value: analytics.totalApplications || 0,
            icon: <FaFileAlt className="text-4xl" />,
            color: "bg-purple-500",
            textColor: "text-purple-500",
        },
        {
            title: "Total Revenue",
            value: `$${(analytics.totalRevenue || 0).toFixed(2)}`,
            icon: <FaMoneyBillWave className="text-4xl" />,
            color: "bg-green-500",
            textColor: "text-green-500",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">
                Analytics Dashboard<span className="text-[#a3e635]">.</span>
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-[#111] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.textColor} opacity-80`}>{stat.icon}</div>
                        </div>
                        <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Scholarships */}
                <div className="bg-[#111] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">
                        Top Scholarships by Applications
                    </h3>
                    {analytics.topScholarships && analytics.topScholarships.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.topScholarships.map((scholarship, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#a3e635]/20 flex items-center justify-center text-[#a3e635] font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{scholarship.name}</p>
                                            <p className="text-xs text-gray-500">{scholarship.university}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#a3e635] font-bold">{scholarship.applications}</p>
                                        <p className="text-xs text-gray-500">applications</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No data available</p>
                    )}
                </div>

                {/* Recent Applications */}
                <div className="bg-[#111] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Recent Applications</h3>
                    {analytics.recentApplications && analytics.recentApplications.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.recentApplications.map((application, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5"
                                >
                                    <div>
                                        <p className="text-white font-semibold">{application.applicantName}</p>
                                        <p className="text-xs text-gray-500">{application.scholarshipName}</p>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`badge badge-sm ${application.status === "Pending"
                                                ? "badge-warning"
                                                : application.status === "Processing"
                                                    ? "badge-info"
                                                    : "badge-success"
                                                }`}
                                        >
                                            {application.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(application.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No recent applications</p>
                    )}
                </div>
            </div>

            {/* User Role Distribution */}
            <div className="mt-6 bg-[#111] rounded-2xl border border-white/5 p-6">
                <h3 className="text-2xl font-bold text-white mb-6">User Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <p className="text-gray-400 text-sm mb-2">Students</p>
                        <p className="text-3xl font-bold text-white">
                            {analytics.usersByRole?.students || 0}
                        </p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <p className="text-gray-400 text-sm mb-2">Moderators</p>
                        <p className="text-3xl font-bold text-white">
                            {analytics.usersByRole?.moderators || 0}
                        </p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <p className="text-gray-400 text-sm mb-2">Admins</p>
                        <p className="text-3xl font-bold text-white">
                            {analytics.usersByRole?.admins || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
