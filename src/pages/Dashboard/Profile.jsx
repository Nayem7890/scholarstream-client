import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">My Profile<span className="text-[#a3e635]">.</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="card bg-[#111] border border-white/5 rounded-[2rem] p-8 text-center md:col-span-1 h-fit">
                    <div className="avatar justify-center mb-6">
                        <div className="w-32 rounded-full ring ring-[#a3e635] ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL} alt="Profile" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{user?.displayName}</h3>
                    <p className="text-gray-400 mb-6">{user?.email}</p>
                    <div className="badge bg-[#a3e635] text-black border-none font-bold px-4 py-3">Student</div>
                </div>

                {/* Details Section */}
                <div className="card bg-black border border-white/10 rounded-[2rem] p-8 md:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-white text-lg">{user?.displayName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Phone</p>
                            <p className="text-white text-lg">+1 (555) 000-0000</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Location</p>
                            <p className="text-white text-lg">New York, USA</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">University</p>
                            <p className="text-white text-lg">Not Set</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="btn bg-white/5 text-white border-white/10 hover:bg-[#a3e635] hover:text-black rounded-full px-8">Edit Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
