import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Home = () => {
    const { data: scholarships = [], isLoading } = useQuery({
        queryKey: ['topScholarships'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships`);
            return res.data.data || []; // Backend returns { data, total, page, totalPages }
        }
    });

    // Safeguard ensuring scholarships is an array
    const topScholarships = Array.isArray(scholarships) ? scholarships : [];

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-lime-400 selection:text-black">

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 max-w-screen-xl mx-auto text-center z-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <p className="text-[#a3e635] font-semibold tracking-widest uppercase mb-4 text-sm">
                        Scholarship Management Platform
                    </p>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                        Find your perfect <br />
                        <span className="text-white">scholarship opportunity</span>
                        <span className="text-[#a3e635] text-7xl leading-[0]">.</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Connect with top universities and secure funding for your education.
                        A centralized platform for students and recruiters.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/all-scholarships" className="btn btn-lg bg-white text-black hover:bg-gray-200 border-none rounded-full px-8 text-lg font-medium flex items-center gap-2">
                            Browse Scholarships <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform" />
                        </Link>
                        <Link to="/register" className="btn btn-lg btn-outline text-white hover:bg-white hover:text-black rounded-full px-8 text-lg font-medium">
                            Get Started
                        </Link>
                    </div>
                </motion.div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            </div>

            {/* Top Scholarships Section - Mivon Style Cards */}
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold">Top Scholarships</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/all-scholarships" className="text-[#a3e635] hover:underline text-lg">See All Opportunities</Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topScholarships.slice(0, 3).map((item, index) => (
                        index === 0 ? (
                            // Featured Large Card - Lime (Index 0)
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="col-span-1 lg:col-span-1 bg-[#a3e635] text-black rounded-[2rem] p-8 flex flex-col justify-between h-[400px] relative overflow-hidden group hover:scale-[1.02] transition-transform"
                            >
                                <div className="z-10">
                                    <h3 className="text-6xl font-bold mb-2">01</h3>
                                    <p className="text-xl font-medium opacity-80">{item.scholarshipCategory}</p>
                                </div>
                                <div className="z-10 mt-auto">
                                    <h2 className="text-3xl font-bold leading-tight mb-2">{item.scholarshipName}</h2>
                                    <p className="font-medium">{item.universityName}</p>
                                </div>
                                <Link to={`/scholarship/${item._id}`}>
                                    <FaArrowRight className="absolute top-8 right-8 text-2xl -rotate-45 group-hover:rotate-0 transition-transform duration-300 cursor-pointer" />
                                </Link>
                                {/* Abstract Shape */}
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
                            </motion.div>
                        ) : (
                            // Dark Card (Index 1 & 2)
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-[#111] text-white rounded-[2rem] p-8 flex flex-col justify-between h-[400px] hover:bg-[#1a1a1a] transition-colors group border border-white/5"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md">{item.degree}</span>
                                    <FaStar className="text-[#a3e635] text-xl" />
                                </div>
                                <div className="mt-8">
                                    <img src={item.universityImage} alt={item.universityName} className="w-16 h-16 rounded-full border-2 border-[#333] mb-4 object-cover" />
                                    <h3 className="text-2xl font-bold mb-2">{item.scholarshipName.slice(0, 20)}...</h3>
                                    <p className="text-gray-400 mb-4">{item.universityName}</p>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Fees</p>
                                            <p className="text-lg font-semibold">${item.applicationFees}</p>
                                        </div>
                                        <Link to={`/scholarship/${item._id}`} className="btn btn-circle btn-sm bg-[#a3e635] text-black border-none hover:bg-lime-400">
                                            <FaArrowRight className="-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </div>
            </div>

            {/* Success Stories Section */}
            <div className="bg-[#111] py-20">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <p className="text-[#a3e635] font-semibold tracking-widest uppercase mb-4 text-sm">Testimonials</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white">Student Success Stories</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-black p-8 rounded-3xl border border-white/5 text-left hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex gap-1 text-[#a3e635] mb-6">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                            <p className="text-gray-300 mb-6 text-lg leading-relaxed">"ScholarStream made it incredibly easy to find funding. I'm now studying at my dream university!"</p>
                            <div className="flex items-center gap-4">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                    <p className="text-sm text-gray-500">Oxford University</p>
                                </div>
                            </div>
                        </div>
                        {/* Review 2 */}
                        <div className="bg-black p-8 rounded-3xl border border-white/5 text-left hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex gap-1 text-[#a3e635] mb-6">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                            <p className="text-gray-300 mb-6 text-lg leading-relaxed">"The application process was streamlined and transparent. Cannot recommend this platform enough."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h4 className="font-bold text-white">Michael Chen</h4>
                                    <p className="text-sm text-gray-500">MIT</p>
                                </div>
                            </div>
                        </div>
                        {/* Review 3 */}
                        <div className="bg-black p-8 rounded-3xl border border-white/5 text-left hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex gap-1 text-[#a3e635] mb-6">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                            <p className="text-gray-300 mb-6 text-lg leading-relaxed">"A game-changer for international students looking for financial aid opportunities."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h4 className="font-bold text-white">Emma Watson</h4>
                                    <p className="text-sm text-gray-500">Stanford</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extra Section: FAQ */}
            <div className="max-w-screen-md mx-auto py-20 px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="join join-vertical w-full bg-[#111] rounded-3xl border border-white/5">
                    <div className="collapse collapse-plus join-item border-b border-white/5">
                        <input type="radio" name="my-accordion-4" defaultChecked />
                        <div className="collapse-title text-xl font-medium text-white">
                            How do I apply for a scholarship?
                        </div>
                        <div className="collapse-content text-gray-400">
                            <p>Simply create an account, browse our extensive list of scholarships, and click the 'Apply' button on any scholarship details page.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus join-item border-b border-white/5">
                        <input type="radio" name="my-accordion-4" />
                        <div className="collapse-title text-xl font-medium text-white">
                            Are there application fees?
                        </div>
                        <div className="collapse-content text-gray-400">
                            <p>Some universities charge a small application processing fee, while others are free. This is clearly listed on each scholarship card.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus join-item">
                        <input type="radio" name="my-accordion-4" />
                        <div className="collapse-title text-xl font-medium text-white">
                            Can I apply for multiple scholarships?
                        </div>
                        <div className="collapse-content text-gray-400">
                            <p>Yes! You can apply for as many scholarships as you are eligible for. Track all your applications in your Student Dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
