import { ReactNode } from 'react'
import { Card } from '../ui/Card'

interface KpiCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KpiCard({ title, value, icon, trend, className = '' }: KpiCardProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="p-3 bg-green-100 rounded-lg">
            <div className="text-green-600">
              {icon}
            </div>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-lg font-medium text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </dd>
          </dl>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}