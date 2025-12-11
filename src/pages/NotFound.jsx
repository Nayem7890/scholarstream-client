import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a3e635]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a3e635]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-3xl w-full text-center relative z-10">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-[200px] md:text-[280px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a3e635] to-lime-300 leading-none animate-pulse">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Page Not Found<span className="text-[#a3e635]">.</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the scholarship universe.
                        Don't worry, we'll help you find your way back!
                    </p>
                </div>

                {/* Suggestions */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 p-8 mb-8">
                    <h3 className="text-white font-bold text-xl mb-4">What can you do?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <p className="text-gray-400">✓ Check the URL for typos</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <p className="text-gray-400">✓ Use the navigation menu</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <p className="text-gray-400">✓ Start from the homepage</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full px-8 h-14 text-lg font-bold flex items-center gap-2"
                    >
                        <FaHome />
                        Go to Homepage
                    </Link>
                    <Link
                        to="/all-scholarships"
                        className="btn btn-outline border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-14 text-lg flex items-center gap-2"
                    >
                        <FaSearch />
                        Browse Scholarships
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-ghost text-gray-400 hover:text-white rounded-full px-8 h-14 text-lg flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Go Back
                    </button>
                </div>

                {/* Fun Message */}
                <div className="mt-12">
                    <p className="text-gray-600 text-sm">
                        Lost in the scholarship maze? 🎓 Don't worry, even the best explorers take wrong turns!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
