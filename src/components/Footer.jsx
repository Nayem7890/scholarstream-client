import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaXTwitter, FaInstagram, FaGithub } from "react-icons/fa6";
import { MdEmail, MdLocationOn } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-b from-[#050505] to-[#0a0a0a] text-gray-300 border-t border-white/10 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635]/5 via-transparent to-lime-500/5 pointer-events-none"></div>

            <div className="relative max-w-screen-xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
                    {/* Brand Section - Larger */}
                    <div className="lg:col-span-5">
                        <Link to="/" className="inline-block group mb-6">
                            <h2 className="text-4xl font-bold text-white">
                                ScholarStream
                                <span className="text-[#a3e635] group-hover:animate-pulse">.</span>
                            </h2>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                            Empowering students worldwide to achieve their academic dreams through accessible scholarship opportunities and financial aid.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-gray-400 hover:text-[#a3e635] transition-colors">
                                <MdEmail className="text-lg flex-shrink-0" />
                                <span>support@scholarstream.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 hover:text-[#a3e635] transition-colors">
                                <MdLocationOn className="text-lg flex-shrink-0" />
                                <span>Serving students globally</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#a3e635] to-transparent"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="group flex items-center gap-2 hover:text-[#a3e635] transition-all duration-300 hover:translate-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#a3e635] transition-colors"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/all-scholarships" className="group flex items-center gap-2 hover:text-[#a3e635] transition-all duration-300 hover:translate-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#a3e635] transition-colors"></span>
                                    Browse Scholarships
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="group flex items-center gap-2 hover:text-[#a3e635] transition-all duration-300 hover:translate-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#a3e635] transition-colors"></span>
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div className="lg:col-span-4">
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Connect With Us
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#a3e635] to-transparent"></span>
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Follow us on social media for the latest scholarship updates and success stories.
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-12 h-12 bg-white/5 hover:bg-[#a3e635] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#a3e635]/20"
                            >
                                <FaXTwitter className="text-xl text-gray-400 group-hover:text-black transition-colors" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-12 h-12 bg-white/5 hover:bg-[#a3e635] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#a3e635]/20"
                            >
                                <FaFacebook className="text-xl text-gray-400 group-hover:text-black transition-colors" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-12 h-12 bg-white/5 hover:bg-[#a3e635] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#a3e635]/20"
                            >
                                <FaLinkedin className="text-xl text-gray-400 group-hover:text-black transition-colors" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-12 h-12 bg-white/5 hover:bg-[#a3e635] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#a3e635]/20"
                            >
                                <FaInstagram className="text-xl text-gray-400 group-hover:text-black transition-colors" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-12 h-12 bg-white/5 hover:bg-[#a3e635] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#a3e635]/20"
                            >
                                <FaGithub className="text-xl text-gray-400 group-hover:text-black transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} <span className="text-[#a3e635] font-semibold">ScholarStream</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <Link to="/" className="text-gray-500 hover:text-[#a3e635] transition-colors">
                                Privacy Policy
                            </Link>
                            <span className="text-gray-700">•</span>
                            <Link to="/" className="text-gray-500 hover:text-[#a3e635] transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a3e635]/50 to-transparent"></div>
        </footer>
    );
};

export default Footer;
