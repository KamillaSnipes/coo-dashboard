'use client'

import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export default function MetricCard({ title, value, subtitle, icon, trend, trendValue }: MetricCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-dark-400',
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-dark-400 text-sm mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-600/20 rounded-lg text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

