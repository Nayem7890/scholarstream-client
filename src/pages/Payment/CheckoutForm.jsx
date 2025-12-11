import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ price, scholarship }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user, loading } = useContext(AuthContext);
    const [cardError, setCardError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Wait until auth loading is done and user is present
        if (!loading && user && price > 0) {
            axiosSecure.post('/create-payment-intent', {
                applicationFees: scholarship.applicationFees,
                serviceCharge: scholarship.serviceCharge
            })
                .then(res => {
                    console.log('PaymentIntent created:', res.data);
                    setClientSecret(res.data.clientSecret);
                })
                .catch(error => {
                    console.error('Error creating payment intent:', error);
                    if (error.response?.status === 401) {
                        setCardError('Session expired. Please log out and log in again.');
                    } else {
                        setCardError('Failed to initialize payment. Please try again.');
                    }
                });
        }
    }, [price, scholarship, user, loading]);

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
        setCardError('');

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setCardError(error.message);
            setProcessing(false);
            return;
        }

        // Confirm the payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email || 'unknown',
                        name: user?.displayName || 'anonymous'
                    },
                },
            },
        );

        if (confirmError) {
            setCardError(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            // Save application to database
            try {
                const applicationData = {
                    scholarshipId: scholarship._id,
                    universityName: scholarship.universityName,
                    scholarshipName: scholarship.scholarshipName,
                    universityCity: scholarship.universityCity,
                    universityCountry: scholarship.universityCountry,
                    subjectCategory: scholarship.subjectCategory,
                    degree: scholarship.degree,
                    applicationFees: scholarship.applicationFees,
                    serviceCharge: scholarship.serviceCharge,
                    applicationDeadline: scholarship.applicationDeadline,
                    userEmail: user?.email,
                    userName: user?.displayName,
                    userPhoto: user?.photoURL,
                    applicationDate: new Date(),
                    applicationStatus: 'pending',
                    paymentStatus: 'paid',
                    transactionId: paymentIntent.id
                };

                await axiosSecure.post('/applications', applicationData);

                setProcessing(false);

                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    text: `Transaction ID: ${paymentIntent.id}`,
                    confirmButtonColor: '#a3e635'
                });

                navigate('/payment-success');
            } catch (error) {
                console.error('Error saving application:', error);
                setProcessing(false);
                Swal.fire({
                    icon: 'warning',
                    title: 'Payment Successful',
                    text: 'Payment was successful but there was an issue saving your application. Please contact support.',
                    confirmButtonColor: '#a3e635'
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-left">
            <div className="p-4 bg-black rounded-xl border border-white/10 mb-2">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#ffffff',
                                '::placeholder': {
                                    color: '#6b7280',
                                },
                            },
                            invalid: {
                                color: '#ef4444',
                            },
                        },
                    }}
                />
            </div>
            <p className="text-red-500 text-sm mt-2 mb-4">{cardError}</p>
            <button
                className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none w-full rounded-full text-lg font-bold"
                type="submit"
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? 'Processing...' : `Pay $${price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;
