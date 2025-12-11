import { Link } from "react-router-dom";

const PaymentSuccess = () => {
    return (
        <div className="hero min-h-screen bg-black text-white">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="w-24 h-24 bg-[#a3e635]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#a3e635]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">Payment Successful!</h1>
                    <p className="py-6 text-gray-400">Thank you for your application. Your transaction has been completed successfully.</p>
                    <Link to="/dashboard/my-applications" className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full px-8">Go to My Applications</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
