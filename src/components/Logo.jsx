const Logo = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 220 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shopping bag icon with modern design */}
      <g transform="translate(8, 8)">
        {/* Bag shadow */}
        <ellipse cx="20" cy="38" rx="18" ry="4" fill="rgba(0,0,0,0.2)" />
        
        {/* Bag body with gradient */}
        <path
          d="M12 12 L12 8 C12 5 14 3 17 3 L23 3 C26 3 28 5 28 8 L28 12 L32 12 L32 35 L8 35 L8 12 Z"
          fill="url(#logoGradient)"
          stroke="white"
          strokeWidth="1.5"
        />
        
        {/* Bag opening highlight */}
        <path
          d="M12 12 L28 12"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
        
        {/* Bag handles */}
        <path
          d="M14 12 C14 10 15 9 16 9 C17 9 18 10 18 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 12 C22 10 23 9 24 9 C25 9 26 10 26 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Sparkle/star effect */}
        <g opacity="0.8">
          <path
            d="M20 18 L20.5 19.5 L22 20 L20.5 20.5 L20 22 L19.5 20.5 L18 20 L19.5 19.5 Z"
            fill="white"
          />
        </g>
      </g>
      
      {/* Brand text with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#2980b9" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ecf0f1" />
        </linearGradient>
      </defs>
      
      <text
        x="50"
        y="32"
        fill="url(#textGradient)"
        fontSize="26"
        fontWeight="700"
        fontFamily="'Segoe UI', Arial, sans-serif"
        letterSpacing="2"
      >
        ShopHub
      </text>
      
      {/* Decorative underline */}
      <line
        x1="50"
        y1="36"
        x2="180"
        y2="36"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Logo

