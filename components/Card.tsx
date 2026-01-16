'use client'

import { ReactNode, MouseEventHandler } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

export default function Card({ title, subtitle, children, className = '', action, onClick }: CardProps) {
  return (
    <div 
      className={`bg-dark-800 rounded-xl border border-dark-700 card ${className}`}
      onClick={onClick}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
          <div>
            {title && <h3 className="font-semibold text-lg">{title}</h3>}
            {subtitle && <p className="text-sm text-dark-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

