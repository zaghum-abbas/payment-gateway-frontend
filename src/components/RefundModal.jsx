import { useState } from 'react';
import { X, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import './RefundModal.css';

const RefundModal = ({ isOpen, onClose, transaction, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('requested_by_customer');
    const [loading, setLoading] = useState(false);

    console.log('RefundModal render:', { isOpen, transaction });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (parseFloat(amount) > transaction.amount) {
            toast.error('Refund amount cannot exceed transaction amount');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                payment_intent_id: transaction.stripe_payment_intent_id,
                amount: parseFloat(amount),
                reason: reason,
                uuid: transaction.uuid
            };

            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/stripe/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Refund processed successfully');
                onSuccess();
                onClose();
                resetForm();
            } else {
                toast.error(data.message || 'Failed to process refund');
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            toast.error('Error processing refund');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setReason('requested_by_customer');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    console.log('RefundModal render:', { isOpen, transaction });

    if (!isOpen || !transaction) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content refund-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Process Refund</h2>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="transaction-details">
                    <div className="detail-item">
                        <span className="detail-label">Transaction ID:</span>
                        <span className="detail-value">{transaction.order_id}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-value">{transaction.customer_name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Original Amount:</span>
                        <span className="detail-value">
                            {new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: transaction.currency || 'GBP'
                            }).format(transaction.amount)}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="amount">
                            <DollarSign size={18} />
                            Refund Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            placeholder="Enter refund amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0.01"
                            max={transaction.amount}
                            required
                        />
                        <span className="input-hint">
                            Maximum: {new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: transaction.currency || 'GBP'
                            }).format(transaction.amount)}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">
                            <FileText size={18} />
                            Reason
                        </label>
                        <select
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        >
                            <option value="requested_by_customer">Requested by Customer</option>
                            <option value="duplicate">Duplicate Transaction</option>
                            <option value="fraudulent">Fraudulent</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Process Refund'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RefundModal;
