import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import ProductList from './pages/ProductList'
import Checkout from './pages/Checkout'
import PaymentPage from './pages/PaymentPage'
import Success from './pages/Success'
import OrganizationsDashboard from './pages/OrganizationsDashboard'
import './App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/pay/:uuid" element={<PaymentPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/organizations" element={<OrganizationsDashboard />} />
            <Route path="/" element={
              <>
                <Navbar />
                <ProductList />
              </>
            } />
            <Route path="/checkout" element={
              <>
                <Navbar />
                <Checkout />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  )
}

export default App

