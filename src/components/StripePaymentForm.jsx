import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './StripePaymentForm.css';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
            padding: '12px',
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
    hidePostalCode: false,
};

const StripePaymentForm = ({ uuid, paymentData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cardholderName, setCardholderName] = useState(paymentData.customer_name || '');
    const [email, setEmail] = useState(paymentData.customer_email || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.error('Stripe has not loaded yet. Please wait.');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            toast.error('Card element not found');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Payment Intent on your server
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/stripe/create-payment-intent`,
                {
                    uuid: uuid,
                    amount: paymentData.total_amount,
                    currency: 'gbp',
                    customer_email: email,
                    customer_name: cardholderName,
                }
            );

            const { clientSecret } = response.data;

            // 2. Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: cardholderName,
                        email: email,
                    },
                },
            });

            console.log('Payment Intent:', paymentIntent);

            if (error) {
                console.error('Payment error:', error);
                toast.error(error.message || 'Payment failed. Please try again.');
            } else
                if (paymentIntent.status === 'succeeded') {
                    // await axios.patch(
                    //     `${import.meta.env.VITE_BASE_URL}/api/v1/organizations/transaction/${uuid}`,
                    //     {
                    //         status: 'paid',
                    //         stripe_payment_id: paymentIntent.id,
                    //     }
                    // );

                    toast.success('Payment successful!');

                    // Redirect to success page or show success message
                    setTimeout(() => {
                        navigate('/success', { state: { paymentIntent, orderData: paymentData } });
                    }, 1500);
                }
        } catch (error) {
            console.error('Payment processing error:', error);
            toast.error(error.response?.data?.error || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-payment-form">
            <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                    type="text"
                    id="cardholderName"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="card-element">Card Details</label>
                <div className="card-element-wrapper">
                    <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            <button type="submit" className="pay-button" disabled={!stripe || loading}>
                <span className="lock-icon">🔒</span>
                {loading ? 'Processing...' : `Pay £${paymentData.total_amount.toFixed(2)}`}
            </button>

            <div className="security-message">
                <span className="shield-icon">🛡️</span>
                <div>
                    <div>Secure payment</div>
                    <div className="security-subtext">
                        Your payment information is encrypted and secure
                    </div>
                </div>
            </div>
        </form>
    );
};

export default StripePaymentForm;
