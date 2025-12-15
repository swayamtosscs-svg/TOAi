const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-12',
    default: 'h-20',
    large: 'h-24',
  }

  return (
    <div className="flex items-center">
      <img 
        src="/Untitled design (1).png" 
        alt="TOAI Logo" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  )
}

export default Logo

