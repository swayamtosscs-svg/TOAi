const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-5',
    default: 'h-10',
    large: 'h-14',
  }

  return (
    <div className="flex items-center justify-center w-full p-0.5">
      <img 
        src="/Untitled design (1).png" 
        alt="TOAI Logo" 
        className={`${sizeClasses[size]} w-auto max-w-[120px] object-contain mx-auto`}
      />
    </div>
  )
}

export default Logo

