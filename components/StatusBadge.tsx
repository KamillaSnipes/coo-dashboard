'use client'

type StatusType = 'green' | 'yellow' | 'red' | 'pending' | 'done'

interface StatusBadgeProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  green: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'В норме' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Внимание' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Проблема' },
  pending: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'В работе' },
  done: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Готово' },
}

const sizeConfig = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeConfig[size]}`}>
      <span className={`w-2 h-2 rounded-full ${config.text.replace('text-', 'bg-')} mr-2`} />
      {config.label}
    </span>
  )
}

