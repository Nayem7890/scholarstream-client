import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaUniversity, FaMoneyBillWave, FaReceipt } from "react-icons/fa";

const PaymentSuccess = () => {
    const location = useLocation();
    const paymentData = location.state || {};

    const {
        scholarshipName = "Scholarship",
        universityName = "University",
        degree = "N/A",
        applicationFees = 0,
        serviceCharge = 0,
        totalAmount = 0,
        transactionId = "N/A",
    } = paymentData;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#a3e635]/20 rounded-full mb-6 animate-pulse">
                        <FaCheckCircle className="text-[#a3e635] text-5xl" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Payment Successful<span className="text-[#a3e635]">!</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your scholarship application has been submitted successfully.
                    </p>
                </div>

                {/* Payment Details Card */}
                <div className="bg-[#111] rounded-[2rem] border border-white/5 p-8 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaReceipt className="text-[#a3e635]" />
                        Payment Receipt
                    </h2>

                    <div className="space-y-4">
                        {/* Scholarship Info */}
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <div className="flex items-start gap-3">
                                <FaUniversity className="text-[#a3e635] mt-1" />
                                <div className="flex-1">
                                    <p className="text-gray-500 text-sm">Scholarship</p>
                                    <p className="text-white font-semibold text-lg">{scholarshipName}</p>
                                    <p className="text-gray-400 text-sm mt-1">{universityName}</p>
                                    <p className="text-gray-500 text-xs mt-1">Degree: {degree}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <div className="flex items-start gap-3">
                                <FaMoneyBillWave className="text-[#a3e635] mt-1" />
                                <div className="flex-1">
                                    <p className="text-gray-500 text-sm mb-3">Payment Breakdown</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Application Fees</span>
                                            <span className="text-white">${Number(applicationFees).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Service Charge</span>
                                            <span className="text-white">${Number(serviceCharge).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-2 flex justify-between">
                                            <span className="text-white font-bold">Total Paid</span>
                                            <span className="text-[#a3e635] font-bold text-xl">
                                                ${Number(totalAmount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction ID */}
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <p className="text-gray-500 text-sm mb-1">Transaction ID</p>
                            <p className="text-white font-mono text-sm break-all">{transactionId}</p>
                        </div>

                        {/* Date */}
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                            <p className="text-gray-500 text-sm mb-1">Date & Time</p>
                            <p className="text-white">{new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/dashboard/my-applications"
                        className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full flex-1 h-14 text-lg font-bold"
                    >
                        Go to My Applications
                    </Link>
                    <Link
                        to="/all-scholarships"
                        className="btn btn-outline border-white/20 text-white hover:bg-white/10 rounded-full flex-1 h-14 text-lg"
                    >
                        Browse More Scholarships
                    </Link>
                </div>

                {/* Info Message */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <p className="text-blue-400 text-sm">
                        📧 A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
