const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Abstract AI symbol - geometric shapes representing AI */}
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Central node */}
          <circle cx="16" cy="16" r="6" fill="url(#logoGradient)" opacity="0.9" />
          {/* Connecting nodes */}
          <circle cx="8" cy="8" r="3" fill="url(#logoGradient)" opacity="0.7" />
          <circle cx="24" cy="8" r="3" fill="url(#logoGradient)" opacity="0.7" />
          <circle cx="8" cy="24" r="3" fill="url(#logoGradient)" opacity="0.7" />
          <circle cx="24" cy="24" r="3" fill="url(#logoGradient)" opacity="0.7" />
          {/* Connection lines */}
          <line x1="16" y1="16" x2="8" y2="8" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.5" />
          <line x1="16" y1="16" x2="24" y2="8" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.5" />
          <line x1="16" y1="16" x2="8" y2="24" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.5" />
          <line x1="16" y1="16" x2="24" y2="24" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>
      {size !== 'small' && (
        <span className="text-xl font-bold text-gradient-toai">TOAI</span>
      )}
    </div>
  )
}

export default Logo

