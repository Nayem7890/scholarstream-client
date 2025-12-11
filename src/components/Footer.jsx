import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaArrowRight } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#050505] text-gray-400 border-t border-white/5 pt-20 pb-10 font-sans">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link to="/" className="text-3xl font-bold text-white block mb-6">ScholarStream<span className="text-[#a3e635]">.</span></Link>
                        <p className="mb-6 leading-relaxed">
                            Empowering students worldwide to achieve their academic dreams through accessible scholarship opportunities and financial aid.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-wider mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><Link to="/all-scholarships" className="hover:text-[#a3e635] transition-colors">Browse Scholarships</Link></li>
                            <li><Link to="/dashboard" className="hover:text-[#a3e635] transition-colors">Student Dashboard</Link></li>
                            <li><Link to="/universities" className="hover:text-[#a3e635] transition-colors">For Universities</Link></li>
                            <li><Link to="/pricing" className="hover:text-[#a3e635] transition-colors">Pricing Plans</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-wider mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><Link to="/blog" className="hover:text-[#a3e635] transition-colors">Success Stories</Link></li>
                            <li><Link to="/guide" className="hover:text-[#a3e635] transition-colors">Application Guide</Link></li>
                            <li><Link to="/faq" className="hover:text-[#a3e635] transition-colors">FAQ</Link></li>
                            <li><Link to="/support" className="hover:text-[#a3e635] transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-wider mb-6">Stay Updated</h3>
                        <p className="text-sm mb-4">Subscribe to get the latest scholarship alerts.</p>
                        <div className="join w-full">
                            <input className="input input-bordered join-item w-full bg-[#111] border-white/10 focus:border-[#a3e635] text-white" placeholder="Email address" />
                            <button className="btn join-item bg-[#a3e635] text-black hover:bg-lime-400 border-none"><FaArrowRight /></button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm opacity-60">© 2024 ScholarStream Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-xl">
                        <a href="#" className="hover:text-[#a3e635] transition-colors"><FaTwitter /></a>
                        <a href="#" className="hover:text-[#a3e635] transition-colors"><FaFacebook /></a>
                        <a href="#" className="hover:text-[#a3e635] transition-colors"><FaLinkedin /></a>
                        <a href="#" className="hover:text-[#a3e635] transition-colors"><FaInstagram /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
