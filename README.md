# Payment Gateway - Shopping Cart

A modern React.js shopping cart application with product listing, cart management, and checkout functionality.

## Features

- 🛍️ Product listing page with dummy products
- 🛒 Add to basket functionality
- 📦 Shopping cart with quantity management
- 💳 Checkout page with order summary
- 🎨 Modern and responsive UI

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar with cart badge
│   └── Navbar.css
├── context/
│   └── CartContext.jsx     # Shopping cart state management
├── pages/
│   ├── ProductList.jsx     # Product listing page
│   ├── ProductList.css
│   ├── Checkout.jsx        # Checkout page
│   └── Checkout.css
├── App.jsx                 # Main app component with routing
├── App.css
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Technologies Used

- React 18
- React Router DOM
- Vite
- CSS3

## Features in Detail

### Product List
- Displays 8 dummy products with images, names, descriptions, and prices
- Add to cart functionality
- Responsive grid layout

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time cart total
- Cart badge in navigation

### Checkout Page
- Cart items display
- Quantity controls
- Order summary with subtotal, shipping, and tax
- Place order functionality

