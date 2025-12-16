const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-8',
    default: 'h-16',
    large: 'h-19',
  }

  return (
    <div className="flex items-center p-2">
      <img 
        src="/Untitled design (1).png" 
        alt="TOAI Logo" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  )
}

export default Logo

