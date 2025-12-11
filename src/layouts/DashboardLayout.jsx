import { Link, Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaBook, FaMoneyBill, FaUser, FaHistory, FaStar } from "react-icons/fa";
import useRole from "../hooks/useRole"; // <-- add this

const DashboardLayout = () => {
    const { isAdmin, isModerator, isRoleLoading } = useRole();

    if (isRoleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open font-sans">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-start bg-black min-h-screen text-white">
                {/* Mobile Toggle */}
                <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden absolute top-4 left-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </label>

                {/* Page Content */}
                <div className="w-full p-8 md:p-12 min-h-screen">
                    <Outlet></Outlet>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-6 w-80 h-full bg-[#111] text-gray-400 border-r border-white/5 text-base">
                    {/* Sidebar Header */}
                    <div className="mb-10 pl-2">
                        <Link to="/" className="text-2xl font-bold text-white">ScholarStream<span className="text-[#a3e635]">.</span></Link>
                    </div>

                    {
                        isAdmin ? <>
                            <li><Link to="/dashboard/profile" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaUser /> Admin Profile</Link></li>
                            <li><Link to="/dashboard/add-scholarship" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaBook /> Add Scholarship</Link></li>
                            <li><Link to="/dashboard/manage-scholarships" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaBook /> Manage Scholarships</Link></li>
                            <li><Link to="/dashboard/manage-users" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaUsers /> Manage Users</Link></li>
                            <li><Link to="/dashboard/analytics" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaMoneyBill /> Analytics</Link></li>
                        </> : isModerator ? <>
                            <li><Link to="/dashboard/profile" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaUser /> My Profile</Link></li>
                            <li><Link to="/dashboard/manage-applications" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaBook /> Manage Applications</Link></li>
                            <li><Link to="/dashboard/all-reviews" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaStar /> All Reviews</Link></li>
                        </> : <>
                            <li><Link to="/dashboard/profile" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaUser /> My Profile</Link></li>
                            <li><Link to="/dashboard/my-applications" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaBook /> My Applications</Link></li>
                            <li><Link to="/dashboard/my-reviews" className="hover:bg-white/5 hover:text-[#a3e635] focus:text-[#a3e635]"><FaStar /> My Reviews</Link></li>
                        </>
                    }

                    <div className="divider before:bg-white/10 after:bg-white/10 my-8"></div>

                    <li><Link to="/" className="hover:bg-white/5 hover:text-[#a3e635]"><FaHome /> Home</Link></li>
                    <li><Link to="/all-scholarships" className="hover:bg-white/5 hover:text-[#a3e635]"><FaBook /> All Scholarships</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
