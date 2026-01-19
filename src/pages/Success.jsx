import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Success.css';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentIntent, orderData } = location.state || {};

    useEffect(() => {
        if (!paymentIntent) {
            navigate('/');
        }
    }, [paymentIntent, navigate]);

    if (!paymentIntent) {
        return null;
    }

    return (
        <div className="success-page">
            <div className="success-container">
                <div className="success-icon">
                    <div className="checkmark-circle">
                        <svg className="checkmark" viewBox="0 0 52 52">
                            <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                </div>

                <h1 className="success-title">Payment Successful!</h1>
                <p className="success-message">
                    Your payment has been processed successfully. You will receive a confirmation email shortly.
                </p>

                <div className="payment-details-card">
                    <h2>Payment Details</h2>
                    <div className="detail-row">
                        <span className="detail-label">Transaction ID:</span>
                        <span className="detail-value">{paymentIntent.id}</span>
                    </div>
                    {orderData && (
                        <>
                            <div className="detail-row">
                                <span className="detail-label">Order ID:</span>
                                <span className="detail-value">{orderData.order_id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Amount Paid:</span>
                                <span className="detail-value">£{(paymentIntent.amount / 100).toFixed(2)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Customer Email:</span>
                                <span className="detail-value">{orderData.customer_email}</span>
                            </div>
                        </>
                    )}
                    <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value success-status">
                            <span className="status-dot"></span>
                            {paymentIntent.status}
                        </span>
                    </div>
                </div>

                <button className="back-home-btn" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default Success;
