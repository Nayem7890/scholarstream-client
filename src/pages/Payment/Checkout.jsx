import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Helper to get public key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

const Checkout = () => {
    const { id } = useParams();

    const { data: scholarship = {}, isLoading, isError, error } = useQuery({
        queryKey: ["scholarship", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/${id}`);
            return res.data;
        },
    });

    if (isLoading)
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-[#a3e635]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    if (isError)
        return (
            <div className="min-h-screen flex justify-center items-center bg-black">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-bold mb-2">Error loading scholarship details</p>
                    <p className="text-gray-400">{error.message}</p>
                </div>
            </div>
        );

    const applicationFees = parseFloat(scholarship.applicationFees) || 0;
    const serviceCharge = parseFloat(scholarship.serviceCharge) || 0;
    const totalAmount = applicationFees + serviceCharge;

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Complete Payment<span className="text-[#a3e635]">.</span>
                    </h1>
                    <p className="text-gray-400">Secure payment powered by Stripe</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Scholarship Details */}
                    <div className="bg-[#111] rounded-[2rem] border border-white/5 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Scholarship Details</h2>

                        {/* Scholarship Image */}
                        {scholarship.universityImage && (
                            <div className="mb-6 rounded-2xl overflow-hidden border border-white/5">
                                <img
                                    src={scholarship.universityImage}
                                    alt={scholarship.universityName}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="space-y-4">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <p className="text-gray-500 text-sm mb-1">Scholarship</p>
                                <p className="text-white font-semibold text-lg">{scholarship.scholarshipName}</p>
                            </div>

                            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                <p className="text-gray-500 text-sm mb-1">University</p>
                                <p className="text-white font-semibold">{scholarship.universityName}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {scholarship.universityCity}, {scholarship.universityCountry}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm mb-1">Degree</p>
                                    <p className="text-white font-semibold">{scholarship.degree}</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-sm mb-1">Category</p>
                                    <p className="text-white font-semibold">{scholarship.scholarshipCategory}</p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-black/50 rounded-xl p-6 border border-white/5 mt-6">
                                <h3 className="text-white font-bold mb-4">Payment Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Application Fees</span>
                                        <span className="text-white">${applicationFees.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Service Charge</span>
                                        <span className="text-white">${serviceCharge.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex justify-between">
                                        <span className="text-white font-bold text-lg">Total Amount</span>
                                        <span className="text-[#a3e635] font-bold text-2xl">${totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Payment Form */}
                    <div className="bg-[#111] rounded-[2rem] border border-white/5 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>

                        <Elements stripe={stripePromise}>
                            <CheckoutForm price={totalAmount} scholarship={scholarship} />
                        </Elements>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span>Secured by Stripe</span>
                        </div>

                        {/* Test Card Info (for development) */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
