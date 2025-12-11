import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ScholarshipDetails = () => {
    const { id } = useParams();

    const { data: scholarship = {}, isLoading, isError, error } = useQuery({
        queryKey: ['scholarship', id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/${id}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center bg-black text-[#a3e635]"> <span className="loading loading-spinner loading-lg"></span> </div>
    }

    if (isError) {
        return <div className="min-h-screen flex justify-center items-center bg-black text-red-500">Error: {error.message}</div>
    }

    return (
        <div className="max-w-screen-xl mx-auto my-20 px-4">
            <div className="card lg:card-side bg-[#111] shadow-xl mb-16 border border-white/5 rounded-[2rem] overflow-hidden">
                <figure className="lg:w-1/2 relative">
                    <img src={scholarship.universityImage} alt={scholarship.universityName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </figure>
                <div className="card-body lg:w-1/2 p-10 relative">
                    <span className="bg-[#a3e635] text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">{scholarship.subjectCategory}</span>
                    <h2 className="card-title text-4xl text-white font-bold mb-2">{scholarship.scholarshipName}</h2>
                    <p className="text-xl text-gray-300 mb-6">{scholarship.universityName}</p>

                    <div className="flex flex-wrap gap-3 mb-8">
                        <div className="badge badge-lg bg-white/5 border-white/10 text-gray-300 p-4">🎓 {scholarship.degree}</div>
                        <div className="badge badge-lg bg-white/5 border-white/10 text-gray-300 p-4">🏆 World Rank: {scholarship.universityWorldRank}</div>
                        <div className="badge badge-lg bg-white/5 border-white/10 text-gray-300 p-4">📍 {scholarship.universityCity}, {scholarship.universityCountry}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 bg-black/30 p-6 rounded-2xl border border-white/5 mb-8">
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider">Deadline</p>
                            <p className="text-white font-semibold text-lg">Dec 31, 2024</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider">Stipend</p>
                            <p className="text-[#a3e635] font-semibold text-lg">$2000 / month</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider">App Fees</p>
                            <p className="text-white font-semibold text-lg">$50</p>
                        </div>
                    </div>

                    <p className="text-gray-400 mb-8 leading-relaxed">
                        This scholarship covers full tuition and provides a monthly living stipend.
                        Suitable for high-achieving students in Engineering fields looking to advance their career with world-class education.
                    </p>

                    <div className="card-actions justify-end mt-auto">
                        <Link to={`/payment/${id}`} className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none btn-lg w-full rounded-full text-lg font-bold">Apply Now</Link>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="my-16">
                <h3 className="text-3xl font-bold mb-8 text-white">Student Reviews</h3>
                {/* Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="avatar">
                                <div className="w-12 rounded-full ring ring-[#a3e635] ring-offset-base-100 ring-offset-2">
                                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="User" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Obi-Wan Kenobi</h4>
                                <p className="text-xs text-gray-500">Student, 2023</p>
                            </div>
                        </div>
                        <p className="text-gray-400">"Great university! The campus is amazing and the scholarship process was smooth."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipDetails;
