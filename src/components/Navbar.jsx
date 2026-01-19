import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Logo from './Logo'
import './Navbar.css'

const Navbar = () => {
  const { getTotalItems } = useCart()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo className="logo-svg" />
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/checkout" className="nav-link cart-link">
            🛒 Cart
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

