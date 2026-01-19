import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import './Checkout.css'
import { useState } from 'react'

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  countryCode: Yup.string().required('Country code is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits'),
  createAccount: Yup.boolean(),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string().required('Postal code is required'),
  addNote: Yup.boolean(),
  delivery: Yup.string().required('Please select a delivery option'),
  payment: Yup.string().required('Please select a payment method'),
})

const Checkout = () => {
  const {
    cartItems,
    getTotalPrice,
    clearCart,
  } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const subtotal = getTotalPrice()


  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/organizations/create-payment-link`,
        {
          organization_id: import.meta.env.VITE_ORGANIZATION_ID,
          amount: subtotal,
          currency: 'GBP',
          customer_name: `${values.firstName} ${values.lastName}`,
          customer_email: values.email,
          order_id: Date.now().toString().slice(-6),
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      )
      clearCart()
      navigate(`${import.meta.env.VITE_CHECKOUT_DOMAIN}/${response.data.uuid}`)
    } catch (error) {
      toast.error(error.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to continue</p>
          <button className="back-to-shop-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+44',
    phone: '',
    createAccount: true,
    country: 'United Kingdom',
    address: '',
    city: '',
    postalCode: '',
    addNote: false,
    delivery: 'royal-mail',
    payment: 'bank-card',
  }

  return (
    <div className="checkout-form-container">
      <div className="checkout-header">
        <h2 className="contact-heading">Contact</h2>
        <a href="#" className="login-link">Log in</a>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="checkout-form">
            {/* Contact Section */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    className="form-input"
                  />
                  <ErrorMessage name="firstName" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className="form-input"
                  />
                  <ErrorMessage name="lastName" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-input"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group phone-group">
                <div className="phone-wrapper">
                  <Field
                    as="select"
                    name="countryCode"
                    className="country-code-select"
                  >
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                  </Field>
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="7400 123456"
                    className="form-input phone-input"
                  />
                </div>
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>

              <div className="checkbox-group">
                <Field
                  type="checkbox"
                  name="createAccount"
                  id="createAccount"
                  className="checkbox-input"
                />
                <label htmlFor="createAccount" className="checkbox-label">
                  We will Create an account with this information.
                </label>
              </div>
              <p className="login-hint">
                If you have an already account, login so we can associate your order with your account.
              </p>
            </div>

            {/* Shipping Address Section */}
            <div className="form-section">
              <h3 className="section-heading">Shipping Address</h3>
              <div className="form-group">
                <Field
                  as="select"
                  name="country"
                  className="form-input"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                </Field>
                <ErrorMessage name="country" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <Field
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="form-input"
                />
                <ErrorMessage name="address" component="div" className="error-message" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Field
                    type="text"
                    name="city"
                    placeholder="City"
                    className="form-input"
                  />
                  <ErrorMessage name="city" component="div" className="error-message" />
                </div>
                <div className="form-group">
                  <Field
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    className="form-input"
                  />
                  <ErrorMessage name="postalCode" component="div" className="error-message" />
                </div>
              </div>

              <div className="checkbox-group">
                <Field
                  type="checkbox"
                  name="addNote"
                  id="addNote"
                  className="checkbox-input"
                />
                <label htmlFor="addNote" className="checkbox-label">
                  Add a note to your order
                </label>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="form-section">
              <h3 className="section-heading">Delivery</h3>
              <div className="radio-group">
                <label className="radio-option">
                  <Field type="radio" name="delivery" value="royal-mail" />
                  <div className="radio-content">
                    <span>Royal Mail 1pm</span>
                    <span className="radio-price">£9.00</span>
                  </div>
                </label>
              </div>
              <ErrorMessage name="delivery" component="div" className="error-message" />
            </div>

            {/* Payment Section */}
            <div className="form-section">
              <h3 className="section-heading">Payment</h3>
              <p className="payment-security">All transactions are secure and encrypted</p>
              <div className="radio-group">
                <label className="radio-option payment-option">
                  <Field type="radio" name="payment" value="bank-card" />
                  <div className="radio-content">
                    <span>Bank Card / Bank Transfer</span>
                    <div className="payment-logos">
                      <span className="visa-logo">Visa</span>
                      <span className="paypal-logo">PayPal</span>
                    </div>
                  </div>
                </label>
              </div>
              <ErrorMessage name="payment" component="div" className="error-message" />
            </div>

            {/* Place Order Button */}
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : 'PLACE ORDER'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Checkout
