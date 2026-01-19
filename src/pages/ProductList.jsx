import { useCart } from '../context/CartContext'
import './ProductList.css'

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: '🎧',
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 249.99,
    image: '⌚',
    description: 'Feature-rich smartwatch with fitness tracking',
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 49.99,
    image: '💻',
    description: 'Ergonomic laptop stand for better posture',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: '⌨️',
    description: 'RGB mechanical keyboard with cherry switches',
  },
  {
    id: 5,
    name: 'Wireless Mouse',
    price: 39.99,
    image: '🖱️',
    description: 'Ergonomic wireless mouse with long battery life',
  },
  {
    id: 6,
    name: 'USB-C Hub',
    price: 34.99,
    image: '🔌',
    description: 'Multi-port USB-C hub with HDMI and USB 3.0',
  },
  {
    id: 7,
    name: 'Desk Lamp',
    price: 29.99,
    image: '💡',
    description: 'LED desk lamp with adjustable brightness',
  },
  {
    id: 8,
    name: 'Webcam HD',
    price: 79.99,
    image: '📹',
    description: '1080p HD webcam with auto-focus',
  },
]

const ProductList = () => {
  const { addToCart } = useCart()

  const handleAddToCart = (product) => {
    addToCart(product)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Our Products</h1>
        <p>Browse our selection of premium products</p>
      </div>
      <div className="products-grid">
        {DUMMY_PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">£{product.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList

