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
        queryKey: ['scholarship', id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="min-h-screen flex justify-center items-center bg-black text-[#a3e635]"> <span className="loading loading-spinner loading-lg"></span> </div>;
    if (isError) return <div className="text-red-500 text-center mt-20">Error loading scholarship details</div>;

    const applicationFees = parseFloat(scholarship.applicationFees) || 0;
    const serviceCharge = parseFloat(scholarship.serviceCharge) || 0;
    const totalAmount = applicationFees + serviceCharge;

    return (
        <div className="max-w-lg mx-auto my-28 p-8 bg-[#111] rounded-[2rem] shadow-xl border border-white/5 text-center">
            <h2 className="text-3xl font-bold mb-2 text-white">Complete Payment</h2>
            <p className="text-gray-400 mb-8">Scholarship: <span className="text-white font-mono">{scholarship.scholarshipName}</span></p>

            <div className="bg-black/50 p-6 rounded-xl mb-8 border border-white/5">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-[#a3e635]">${totalAmount}</p>
                <p className="text-xs text-gray-500 mt-2">(Fees: ${applicationFees} + Service: ${serviceCharge})</p>
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm price={totalAmount} scholarship={scholarship} />
            </Elements>

        </div>
    );
};

export default Checkout;
