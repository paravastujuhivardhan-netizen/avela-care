import React from 'react'

interface AvelaLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  onClick?: () => void
}

export const AvelaLogo: React.FC<AvelaLogoProps> = ({ 
  size = 'md', 
  showTagline = false,
  onClick 
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div 
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group transition-opacity hover:opacity-90`}
      onClick={onClick}
    >
      {/* SVG Continuity Loop Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-[#173F3A] shadow-sm text-[#F4D8CA] p-1.5`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Continuous infinity / care loop */}
          <path 
            d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24" 
            stroke="#F4D8CA" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
          />
          <path 
            d="M16 24C11.5817 24 8 20.4183 8 16" 
            stroke="#E8F0E9" 
            strokeWidth="2.75" 
            strokeLinecap="round" 
            strokeDasharray="2 4"
          />
          <circle cx="16" cy="16" r="3.25" fill="#E8F0E9" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-editorial font-bold tracking-tight text-[#173F3A] leading-none ${textSizes[size]}`}>
          AVELA
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide uppercase text-[#596963] mt-0.5">
            Your care, continued
          </span>
        )}
      </div>
    </div>
  )
}

