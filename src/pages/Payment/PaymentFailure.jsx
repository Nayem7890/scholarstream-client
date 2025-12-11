import { Link, useLocation } from "react-router-dom";
import { FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const PaymentFailure = () => {
    const location = useLocation();
    const { scholarshipName = "Scholarship", error = "Payment could not be processed" } =
        location.state || {};

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Error Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6">
                        <FaTimesCircle className="text-red-500 text-5xl" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Payment Failed<span className="text-red-500">.</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        We couldn't process your payment. Please try again.
                    </p>
                </div>

                {/* Error Details Card */}
                <div className="bg-[#111] rounded-[2rem] border border-red-500/20 p-8 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6">What Happened?</h2>

                    <div className="space-y-4">
                        {/* Scholarship Info */}
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <p className="text-gray-500 text-sm mb-1">Scholarship</p>
                            <p className="text-white font-semibold text-lg">{scholarshipName}</p>
                        </div>

                        {/* Error Message */}
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                            <div className="flex items-start gap-3">
                                <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-red-400 font-semibold mb-1">Error Details</p>
                                    <p className="text-gray-300 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>

                        {/* Application Status */}
                        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                            <p className="text-yellow-400 font-semibold mb-2">📝 Application Status</p>
                            <p className="text-gray-300 text-sm">
                                Your application has been saved with <span className="text-yellow-400 font-semibold">unpaid</span> status.
                                You can retry the payment from your dashboard.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Common Reasons */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6 mb-6">
                    <h3 className="text-white font-bold mb-3">Common Reasons for Payment Failure:</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-[#a3e635]">•</span>
                            <span>Insufficient funds in your account</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#a3e635]">•</span>
                            <span>Incorrect card details or expired card</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#a3e635]">•</span>
                            <span>Card declined by your bank</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#a3e635]">•</span>
                            <span>Network or connection issues</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/dashboard/my-applications"
                        className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full flex-1 h-14 text-lg font-bold"
                    >
                        Go to Dashboard & Retry
                    </Link>
                    <Link
                        to="/all-scholarships"
                        className="btn btn-outline border-white/20 text-white hover:bg-white/10 rounded-full flex-1 h-14 text-lg"
                    >
                        Browse Scholarships
                    </Link>
                </div>

                {/* Help Message */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <p className="text-blue-400 text-sm">
                        💬 Need help? Contact our support team at{" "}
                        <a href="mailto:support@scholarstream.com" className="text-[#a3e635] hover:underline">
                            support@scholarstream.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
