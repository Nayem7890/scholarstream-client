import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaStar, FaSearch, FaCheckCircle, FaFileAlt, FaGraduationCap, FaUsers, FaAward, FaGlobe } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useEffect, useState } from "react";

// Animated Counter Component//
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);

            if (progress < 1) {
                setCount(Math.floor(end * progress));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
    const { data: scholarships = [], isLoading } = useQuery({
        queryKey: ['topScholarships'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships`);
            return res.data.data || [];
        }
    });

    const topScholarships = Array.isArray(scholarships) ? scholarships : [];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-lime-400 selection:text-black overflow-hidden">

            {/* Enhanced Hero Section */}
            <div className="relative pt-32 pb-32 px-4 max-w-screen-xl mx-auto text-center">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 -z-10">
                    <motion.div
                        className="absolute top-0 left-1/4 w-96 h-96 bg-[#a3e635]/20 rounded-full blur-[120px]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px]"
                        animate={{
                            x: [-50, 50, -50],
                            opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Floating Particles */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#a3e635]/40 rounded-full"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.2,
                        }}
                    />
                ))}

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.p
                        variants={itemVariants}
                        className="text-[#a3e635] font-semibold tracking-widest uppercase mb-6 text-sm"
                    >
                        🎓 Scholarship Management Platform
                    </motion.p>

                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
                        variants={itemVariants}
                    >
                        Find your perfect <br />
                        <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                            scholarship opportunity
                        </span>
                        <motion.span
                            className="text-[#a3e635]"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            .
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        Connect with top universities worldwide and secure funding for your education.
                        Join thousands of students who have achieved their academic dreams.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
                    >
                        <Link
                            to="/all-scholarships"
                            className="group btn btn-lg bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full px-10 text-lg font-semibold shadow-lg shadow-[#a3e635]/20 hover:shadow-xl hover:shadow-[#a3e635]/30 transition-all"
                        >
                            <FaSearch className="text-xl" />
                            Browse Scholarships
                            <FaArrowRight className="text-lg -rotate-45 group-hover:rotate-0 transition-transform" />
                        </Link>
                        <Link
                            to="/register"
                            className="btn btn-lg bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 rounded-full px-10 text-lg font-semibold backdrop-blur-sm transition-all"
                        >
                            Get Started Free
                        </Link>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-2 text-gray-500"
                    >
                        <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2"
                        >
                            <motion.div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Statistics Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative py-20 px-4"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#a3e635]/5 via-transparent to-purple-500/5" />
                <div className="max-w-screen-xl mx-auto relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: FaAward, value: 10000, suffix: "+", label: "Scholarships" },
                            { icon: FaUsers, value: 5000, suffix: "+", label: "Students Funded" },
                            { icon: FaGlobe, value: 50, suffix: "+", label: "Countries" },
                            { icon: FaGraduationCap, value: 200, suffix: "+", label: "Universities" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <stat.icon className="text-4xl text-[#a3e635] mx-auto mb-4" />
                                <h3 className="text-4xl md:text-5xl font-bold mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </h3>
                                <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Top Scholarships Section */}
            <div className="max-w-screen-xl mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-[#a3e635] font-semibold tracking-widest uppercase mb-2 text-sm">Featured</p>
                        <h2 className="text-4xl md:text-5xl font-bold">Top Scholarships</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/all-scholarships" className="text-[#a3e635] hover:underline text-lg flex items-center gap-2 group">
                            See All Opportunities
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topScholarships.slice(0, 6).map((item, index) => (
                        index === 0 ? (
                            // Featured Large Card - Lime (Index 0)
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                className="col-span-1 lg:col-span-1 bg-gradient-to-br from-[#a3e635] to-lime-400 text-black rounded-[2rem] p-8 flex flex-col justify-between h-[400px] relative overflow-hidden group shadow-xl shadow-[#a3e635]/20"
                            >
                                <div className="z-10">
                                    <motion.h3
                                        className="text-6xl font-bold mb-2"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        01
                                    </motion.h3>
                                    <p className="text-xl font-medium opacity-80">{item.scholarshipCategory}</p>
                                </div>
                                <div className="z-10 mt-auto">
                                    <h2 className="text-3xl font-bold leading-tight mb-2">{item.scholarshipName}</h2>
                                    <p className="font-medium">{item.universityName}</p>
                                </div>
                                <Link to={`/scholarship/${item._id}`} className="absolute top-8 right-8">
                                    <motion.div
                                        whileHover={{ rotate: 0, scale: 1.1 }}
                                        className="w-12 h-12 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <FaArrowRight className="text-2xl -rotate-45" />
                                    </motion.div>
                                </Link>
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                            </motion.div>
                        ) : (
                            // Dark Cards (Index 1-5)
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-[#111] to-[#0a0a0a] text-white rounded-[2rem] p-8 flex flex-col justify-between h-[400px] hover:bg-[#1a1a1a] transition-colors group border border-white/10 shadow-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">
                                        {item.degree}
                                    </span>
                                    <FaStar className="text-[#a3e635] text-xl" />
                                </div>
                                <div className="mt-8">
                                    <img
                                        src={item.universityImage}
                                        alt={item.universityName}
                                        className="w-16 h-16 rounded-full border-2 border-[#333] mb-4 object-cover ring-2 ring-[#a3e635]/20"
                                    />
                                    <h3 className="text-2xl font-bold mb-2 line-clamp-2">{item.scholarshipName}</h3>
                                    <p className="text-gray-400 mb-4">{item.universityName}</p>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Application Fee</p>
                                            <p className="text-lg font-semibold text-[#a3e635]">${item.applicationFees}</p>
                                        </div>
                                        <Link
                                            to={`/scholarship/${item._id}`}
                                            className="btn btn-circle btn-sm bg-[#a3e635] text-black border-none hover:bg-lime-400 shadow-lg shadow-[#a3e635]/20"
                                        >
                                            <FaArrowRight className="-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </div>
            </div>

            {/* How It Works Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-black via-[#0a0a0a] to-black py-20"
            >
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-[#a3e635] font-semibold tracking-widest uppercase mb-4 text-sm">Simple Process</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Get started with your scholarship journey in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#a3e635]/50 via-[#a3e635] to-[#a3e635]/50" />

                        {[
                            {
                                icon: FaSearch,
                                title: "Search & Discover",
                                description: "Browse through thousands of scholarships from top universities worldwide. Filter by country, degree, and field of study."
                            },
                            {
                                icon: FaFileAlt,
                                title: "Apply Online",
                                description: "Submit your application with our streamlined process. Upload documents and track your progress in real-time."
                            },
                            {
                                icon: FaCheckCircle,
                                title: "Get Funded",
                                description: "Receive notifications about your application status. Celebrate your success and start your academic journey!"
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 rounded-3xl border border-white/10 hover:border-[#a3e635]/50 transition-all duration-300 h-full">
                                    <motion.div
                                        className="w-20 h-20 bg-gradient-to-br from-[#a3e635] to-lime-400 rounded-2xl flex items-center justify-center mb-6 mx-auto relative"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <step.icon className="text-3xl text-black" />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-[#a3e635] font-bold text-sm">
                                            {index + 1}
                                        </div>
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-4 text-center">{step.title}</h3>
                                    <p className="text-gray-400 text-center leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Success Stories Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-[#111] py-20"
            >
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <p className="text-[#a3e635] font-semibold tracking-widest uppercase mb-4 text-sm">Testimonials</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Student Success Stories</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
                        Hear from students who transformed their dreams into reality
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Jenkins",
                                university: "Oxford University",
                                image: "https://randomuser.me/api/portraits/women/44.jpg",
                                quote: "ScholarStream made it incredibly easy to find funding. I'm now studying at my dream university!"
                            },
                            {
                                name: "Michael Chen",
                                university: "MIT",
                                image: "https://randomuser.me/api/portraits/men/32.jpg",
                                quote: "The application process was streamlined and transparent. Cannot recommend this platform enough."
                            },
                            {
                                name: "Emma Watson",
                                university: "Stanford",
                                image: "https://randomuser.me/api/portraits/women/68.jpg",
                                quote: "A game-changer for international students looking for financial aid opportunities."
                            }
                        ].map((review, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-gradient-to-br from-black to-[#0a0a0a] p-8 rounded-3xl border border-white/10 text-left hover:border-[#a3e635]/50 transition-all duration-300 shadow-lg"
                            >
                                <div className="flex gap-1 text-[#a3e635] mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 text-lg leading-relaxed">"{review.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={review.image}
                                        alt={review.name}
                                        className="w-14 h-14 rounded-full ring-2 ring-[#a3e635]/30"
                                    />
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                        <p className="text-sm text-gray-400">{review.university}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-screen-md mx-auto py-20 px-4"
            >
                <div className="text-center mb-12">
                    <p className="text-[#a3e635] font-semibold tracking-widest uppercase mb-4 text-sm">Got Questions?</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400">Everything you need to know about ScholarStream</p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    className="join join-vertical w-full bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden"
                >
                    {[
                        {
                            question: "How do I apply for a scholarship?",
                            answer: "Simply create an account, browse our extensive list of scholarships, and click the 'Apply' button on any scholarship details page. Fill out the application form and submit your documents."
                        },
                        {
                            question: "Are there application fees?",
                            answer: "Some universities charge a small application processing fee, while others are free. This is clearly listed on each scholarship card so you can make informed decisions."
                        },
                        {
                            question: "Can I apply for multiple scholarships?",
                            answer: "Yes! You can apply for as many scholarships as you are eligible for. Track all your applications in your Student Dashboard and manage them efficiently."
                        }
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="collapse collapse-plus join-item border-b border-white/5 last:border-b-0"
                        >
                            <input type="radio" name="my-accordion-4" defaultChecked={index === 0} />
                            <div className="collapse-title text-xl font-medium text-white hover:text-[#a3e635] transition-colors">
                                {faq.question}
                            </div>
                            <div className="collapse-content text-gray-400">
                                <p className="leading-relaxed">{faq.answer}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative py-20 px-4 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#a3e635]/10 via-purple-500/10 to-[#a3e635]/10" />
                <div className="max-w-screen-lg mx-auto text-center relative">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Ready to start your journey?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto"
                    >
                        Join thousands of students who have secured their future with ScholarStream
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to="/all-scholarships"
                            className="btn btn-lg bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full px-12 text-lg font-semibold shadow-2xl shadow-[#a3e635]/30 hover:shadow-[#a3e635]/50 transition-all group"
                        >
                            Explore Scholarships Now
                            <FaArrowRight className="text-lg -rotate-45 group-hover:rotate-0 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

        </div>
    );
};

export default Home;
