import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ price, scholarship }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user, loading } = useContext(AuthContext);
    const [cardError, setCardError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Wait until auth loading is done and user is present
        if (!loading && user && price > 0) {
            axiosSecure
                .post("/create-payment-intent", {
                    applicationFees: scholarship.applicationFees,
                    serviceCharge: scholarship.serviceCharge,
                })
                .then((res) => {
                    console.log("PaymentIntent created:", res.data);
                    setClientSecret(res.data.clientSecret);
                })
                .catch((error) => {
                    console.error("Error creating payment intent:", error);
                    if (error.response?.status === 401) {
                        setCardError("Session expired. Please log out and log in again.");
                    } else {
                        setCardError("Failed to initialize payment. Please try again.");
                    }
                });
        }
    }, [price, scholarship, user, loading]);

    const saveApplication = async (paymentStatus, transactionId = null, errorMessage = null) => {
        try {
            const applicationData = {
                scholarshipId: scholarship._id,
                userId: user?.uid || user?.email, // Use uid if available, fallback to email
                userName: user?.displayName || "Anonymous",
                userEmail: user?.email,
                universityName: scholarship.universityName,
                scholarshipCategory: scholarship.scholarshipCategory,
                degree: scholarship.degree,
                applicationFees: scholarship.applicationFees,
                serviceCharge: scholarship.serviceCharge,
                applicationStatus: "Pending",
                paymentStatus: paymentStatus,
                applicationDate: new Date().toISOString(),
                transactionId: transactionId,
                feedback: "",
            };

            const res = await axiosSecure.post("/applications", applicationData);
            return res.data;
        } catch (error) {
            console.error("Error saving application:", error);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            return;
        }

        setProcessing(true);
        setCardError("");

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (error) {
            console.log("[error]", error);
            setCardError(error.message);
            setProcessing(false);
            return;
        }

        // Confirm the payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || "unknown",
                    name: user?.displayName || "anonymous",
                },
            },
        });

        if (confirmError) {
            console.error("Payment confirmation error:", confirmError);
            setCardError(confirmError.message);

            // Save application with unpaid status on payment failure
            try {
                await saveApplication("unpaid", null, confirmError.message);
                toast.error("Payment failed. Application saved as unpaid.");
                setProcessing(false);
                // Redirect to failure page with error details
                navigate("/payment-failure", {
                    state: {
                        scholarshipName: scholarship.scholarshipName,
                        error: confirmError.message,
                    },
                });
            } catch (saveError) {
                console.error("Error saving failed application:", saveError);
                toast.error("Payment failed and could not save application. Please try again.");
                setProcessing(false);
            }
            return;
        }

        if (paymentIntent.status === "succeeded") {
            // Save application to database with paid status
            try {
                const savedApp = await saveApplication("paid", paymentIntent.id);

                setProcessing(false);
                toast.success("Payment successful!");

                // Redirect to success page with application details
                navigate("/payment-success", {
                    state: {
                        scholarshipName: scholarship.scholarshipName,
                        universityName: scholarship.universityName,
                        degree: scholarship.degree,
                        applicationFees: scholarship.applicationFees,
                        serviceCharge: scholarship.serviceCharge,
                        totalAmount: price,
                        transactionId: paymentIntent.id,
                        applicationId: savedApp.insertedId || savedApp._id,
                    },
                });
            } catch (error) {
                console.error("Error saving application:", error);
                setProcessing(false);
                toast.error("Payment successful but failed to save application. Please contact support.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Display */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-gray-400">Email</span>
                </label>
                <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="input input-bordered bg-black/30 text-white border-white/10"
                />
            </div>

            {/* Card Information */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-gray-400">Card Information</span>
                </label>
                <div className="p-4 bg-black/30 rounded-xl border border-white/10 focus-within:border-[#a3e635] transition-colors">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#ffffff",
                                    "::placeholder": {
                                        color: "#6b7280",
                                    },
                                    iconColor: "#a3e635",
                                },
                                invalid: {
                                    color: "#ef4444",
                                    iconColor: "#ef4444",
                                },
                            },
                        }}
                    />
                </div>
                {cardError && (
                    <label className="label">
                        <span className="label-text-alt text-red-500">{cardError}</span>
                    </label>
                )}
            </div>

            {/* Test Card Information */}
            <div className="bg-gradient-to-br from-[#a3e635]/10 to-lime-500/5 border border-[#a3e635]/30 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="bg-[#a3e635] p-2 rounded-lg">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">Test Mode - Use Test Card</h4>
                        <p className="text-gray-400 text-sm">Use the following test card for payment testing</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Card Number</p>
                        <div className="flex items-center justify-between">
                            <p className="text-white font-mono text-sm">4242 4242 4242 4242</p>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText("4242424242424242");
                                    toast.success("Card number copied!");
                                }}
                                className="text-[#a3e635] hover:text-lime-400 transition-colors"
                                title="Copy card number"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                        <p className="text-white font-mono text-sm">Any future date</p>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">CVC</p>
                        <p className="text-white font-mono text-sm">Any 3 digits</p>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">ZIP Code</p>
                        <p className="text-white font-mono text-sm">Any 5 digits</p>
                    </div>
                </div>
            </div>

            {/* Name on Card */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-gray-400">Name on Card</span>
                </label>
                <input
                    type="text"
                    value={user?.displayName || ""}
                    disabled
                    className="input input-bordered bg-black/30 text-white border-white/10"
                />
            </div>

            {/* Submit Button */}
            <button
                className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none w-full rounded-full text-lg font-bold h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? (
                    <span className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        Processing...
                    </span>
                ) : (
                    `Pay $${price.toFixed(2)}`
                )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
                By confirming your payment, you agree to our terms and conditions.
            </p>
        </form>
    );
};

export default CheckoutForm;
