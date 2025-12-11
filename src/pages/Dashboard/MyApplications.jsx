import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";

const MyApplications = () => {
    const { data: applications = [], isLoading, isError, error } = useQuery({
        queryKey: ['myApplications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications/me');
            return res.data;
        }
    });

    const getStatusColor = (status) => {
        if (status === 'approved' || status === 'Approved') return 'text-[#a3e635] bg-[#a3e635]/10';
        if (status === 'rejected' || status === 'Rejected') return 'text-red-400 bg-red-400/10';
        return 'text-yellow-400 bg-yellow-400/10';
    }

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-white">My Applications<span className="text-[#a3e635]">.</span></h2>
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg text-[#a3e635]"></span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-white">My Applications<span className="text-[#a3e635]">.</span></h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                    <p className="text-red-400">Error loading applications: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">My Applications<span className="text-[#a3e635]">.</span></h2>

            {applications.length === 0 ? (
                <div className="bg-[#111] rounded-[2rem] border border-white/5 p-12 text-center">
                    <p className="text-gray-400 text-lg mb-4">You haven't applied to any scholarships yet.</p>
                    <Link to="/all-scholarships" className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full">
                        Browse Scholarships
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-[#111] rounded-[2rem] border border-white/5 p-2">
                    <table className="table w-full">
                        {/* head */}
                        <thead className="text-gray-400 border-b border-white/10">
                            <tr>
                                <th>#</th>
                                <th>Scholarship</th>
                                <th>University</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {applications.map((app, index) => (
                                <tr key={app._id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                    <th>{index + 1}</th>
                                    <td className="font-bold text-white">{app.scholarshipName}</td>
                                    <td>{app.universityName}</td>
                                    <td>{formatDate(app.applicationDate)}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.applicationStatus)}`}>
                                            {app.applicationStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.paymentStatus === 'paid' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                                            {app.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/scholarship/${app.scholarshipId}`} className="btn btn-ghost btn-xs text-[#a3e635]">details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
