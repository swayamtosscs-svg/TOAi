const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-8',
    default: 'h-12',
    large: 'h-16',
  }

  return (
    <div className="flex items-center">
      <img 
        src="/toai-logo.jpeg" 
        alt="TOAI Logo" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  )
}

export default Logo

