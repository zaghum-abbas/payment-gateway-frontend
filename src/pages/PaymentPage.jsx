import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripePaymentForm from '../components/StripePaymentForm'
import './PaymentPage.css'

const PaymentPage = () => {
  const { uuid } = useParams()
  const [paymentData, setPaymentData] = useState({
    order_id: '',
    customer_name: '',
    customer_email: '',
    subtotal: 0,
    processing_fee: 0,
    total_amount: 0,
    logo_url: '',
    merchant_name: ''
  })
  const [loading, setLoading] = useState(true)
  const [stripePromise, setStripePromise] = useState(null)

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/organizations/transaction/${uuid}`
        )

        if (response.data.success && response.data.data) {
          const transaction = response.data.data
          const subtotal = transaction.amount || 0
          const processingFee = transaction.processing_fee || 0.42
          const total = subtotal + processingFee

          setPaymentData({
            order_id: transaction.order_id || '',
            customer_name: transaction.customer_name || '',
            customer_email: transaction.customer_email || '',
            subtotal: subtotal,
            processing_fee: processingFee,
            total_amount: total,
            logo_url: transaction.logo_url || '',
            merchant_name: transaction.organization_name || ''
          })
        }
      } catch (error) {
        console.error('Failed to fetch transaction data:', error)
        if (error.response?.status === 404) {
          toast.error('Transaction not found')
        } else {
          toast.error('Failed to load payment details. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    const loadStripeConfig = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/stripe/config`,
          {
            organization_id: import.meta.env.VITE_ORGANIZATION_ID
          }
        )

        if (response.data.success && response.data.publishable_key) {
          const stripe = await loadStripe(response.data.publishable_key)
          setStripePromise(stripe)
        }
      } catch (error) {
        console.error('Failed to load Stripe config:', error)
        toast.error('Failed to initialize payment system')
      }
    }

    if (uuid) {
      fetchTransactionData()
      loadStripeConfig()
    }
  }, [uuid])

  if (loading || !stripePromise) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-left">
          {/* <div className="merchant-logo">
            {paymentData.logo_url ? (
              <img src={paymentData.logo_url} alt={paymentData.merchant_name} />
            ) : (
              <div className="logo-placeholder">
                <div className="logo-square">UK HEAL</div>
                <div className="logo-text">UKHeal</div>
              </div>
            )}
          </div> */}

          <div className="order-id">{paymentData.order_id}</div>

          <div className="customer-details-card">
            <h3>Customer Details</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{paymentData.customer_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{paymentData.customer_email}</span>
            </div>
          </div>

          <div className="payment-summary-card">
            <h3>Payment Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>£ {paymentData.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Processing Fee:</span>
              <span>£ {paymentData.processing_fee.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span>£ {paymentData.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="powered-by">
            <span>Powered by</span>
            <div className="paypoq-logo">P</div>
          </div>
        </div>

        <div className="payment-right">
          <div className="payment-header">
            <h1>Payment Information</h1>
            <p>Select a payment method and complete your payment</p>
          </div>

          <div className="payment-method-card">
            <label className="payment-method-option">
              <input type="radio" name="payment_method" value="card" defaultChecked />
              <span>Credit/Debit Card</span>
            </label>
            <p className="payment-method-description">
              Pay securely with your debit or credit card via Stripe.
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <StripePaymentForm uuid={uuid} paymentData={paymentData} />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

