import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import { FaUsers, FaBook, FaMoneyBillWave, FaFileAlt } from "react-icons/fa";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const ROLE_COLORS = ["#a3e635", "#6366f1", "#f97316"]; // students, moderators, admins

const Analytics = () => {
    // Fetch analytics data
    const { data: analytics = {}, isLoading, error } = useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const res = await axiosSecure.get("/analytics");
            return res.data?.data || res.data; // handle both {data: {}} and direct object
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
            textColor: "text-blue-500",
        },
        {
            title: "Total Scholarships",
            value: analytics.totalScholarships || 0,
            icon: <FaBook className="text-4xl" />,
            textColor: "text-[#a3e635]",
        },
        {
            title: "Total Applications",
            value: analytics.totalApplications || 0,
            icon: <FaFileAlt className="text-4xl" />,
            textColor: "text-purple-500",
        },
        {
            title: "Total Revenue",
            value: `$${Number(analytics.totalRevenue || 0).toFixed(2)}`,
            icon: <FaMoneyBillWave className="text-4xl" />,
            textColor: "text-green-500",
        },
    ];

    // ----- Chart data -----

    // Bar chart: Top scholarships
    const topScholarshipsData = (analytics.topScholarships || []).map((item) => ({
        name: item.name?.length > 16 ? item.name.slice(0, 16) + "…" : item.name,
        fullName: item.name,
        university: item.university,
        applications: item.applications,
    }));

    // Pie chart: User role distribution
    const usersByRole = analytics.usersByRole || {};
    const userRoleData = [
        { name: "Students", value: usersByRole.students || 0 },
        { name: "Moderators", value: usersByRole.moderators || 0 },
        { name: "Admins", value: usersByRole.admins || 0 },
    ].filter((item) => item.value > 0); // hide zero slices

    const recentApplications = analytics.recentApplications || [];

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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* Bar Chart: Top Scholarships */}
                <div className="bg-[#111] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">
                        Applications per Scholarship
                    </h3>
                    {topScholarshipsData.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topScholarshipsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        tick={{ fontSize: 12 }}
                                        angle={-20}
                                        textAnchor="end"
                                    />
                                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#020617",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "0.75rem",
                                            color: "#e5e7eb",
                                        }}
                                        formatter={(value, name, entry) => [value, "Applications"]}
                                        labelFormatter={(label) => {
                                            const full = topScholarshipsData.find((d) => d.name === label)?.fullName;
                                            return full || label;
                                        }}
                                    />
                                    <Bar dataKey="applications" fill="#a3e635" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No application data available</p>
                    )}
                </div>

                {/* Pie Chart: User Roles */}
                <div className="bg-[#111] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">User Role Distribution</h3>
                    {userRoleData.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-full md:w-1/2 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={userRoleData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={4}
                                        >
                                            {userRoleData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#020617",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "0.75rem",
                                                color: "#e5e7eb",
                                            }}
                                            formatter={(value, name) => [`${value}`, name]}
                                        />
                                        <Legend
                                            wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
                                            iconType="circle"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full md:w-1/2 space-y-3">
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-400 text-sm mb-1">Students</p>
                                    <p className="text-2xl font-bold text-white">
                                        {usersByRole.students || 0}
                                    </p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-400 text-sm mb-1">Moderators</p>
                                    <p className="text-2xl font-bold text-white">
                                        {usersByRole.moderators || 0}
                                    </p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-400 text-sm mb-1">Admins</p>
                                    <p className="text-2xl font-bold text-white">
                                        {usersByRole.admins || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No user data available</p>
                    )}
                </div>
            </div>

            {/* Recent Activity (lists, like you already had) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Scholarships List */}
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

                {/* Recent Applications List */}
                <div className="bg-[#111] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Recent Applications</h3>
                    {recentApplications.length > 0 ? (
                        <div className="space-y-4">
                            {recentApplications.map((application, index) => (
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
                                            className={`badge badge-sm ${
                                                application.status === "Pending"
                                                    ? "badge-warning"
                                                    : application.status === "Processing"
                                                    ? "badge-info"
                                                    : application.status === "Rejected"
                                                    ? "badge-error"
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
        </div>
    );
};

export default Analytics;
