import React from 'react'
import { PathwayType } from '../../types'
import { FileText, Clock, AlertTriangle, AlertOctagon } from 'lucide-react'

interface PathwayBadgeProps {
  pathway: PathwayType
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export const PathwayBadge: React.FC<PathwayBadgeProps> = ({ 
  pathway, 
  size = 'md',
  showIcon = true 
}) => {
  const configs = {
    'care-plan-explanation': {
      label: 'Explaining your care plan',
      bg: 'bg-[#E8F0E9]',
      text: 'text-[#173F3A]',
      border: 'border-[#CADBD0]',
      icon: FileText
    },
    'clinical-review': {
      label: 'Needs clinician review',
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
      border: 'border-[#FDE68A]',
      icon: Clock
    },
    'time-sensitive': {
      label: 'Time-sensitive contact',
      bg: 'bg-[#FFEDD5]',
      text: 'text-[#C2410C]',
      border: 'border-[#FED7AA]',
      icon: AlertTriangle
    },
    'emergency': {
      label: 'Emergency action',
      bg: 'bg-[#FEE2E2]',
      text: 'text-[#991B1B]',
      border: 'border-[#FECACA]',
      icon: AlertOctagon
    }
  }

  const current = configs[pathway] || configs['care-plan-explanation']
  const Icon = current.icon

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm'

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${padding} transition-all`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{current.label}</span>
    </span>
  )
}

