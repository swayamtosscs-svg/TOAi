const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-14',
    default: 'h-24',
    large: 'h-28',
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

