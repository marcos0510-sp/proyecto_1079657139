import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface Alert {
  id: string
  type: 'low_stock' | 'pending_transfer' | 'system'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  farmName?: string
  warehouseName?: string
}

interface AlertsPanelProps {
  alerts: Alert[]
  className?: string
  onAlertClick?: (alert: Alert) => void
}

export function AlertsPanel({ alerts, className = '', onAlertClick }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'neutral'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'pending_transfer':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      case 'system':
        return (
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  if (alerts.length === 0) {
    return (
      <Card title="Alertas" className={className}>
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sin alertas</h3>
          <p className="mt-1 text-sm text-gray-500">Todo está funcionando correctamente.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Alertas" className={className}>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start space-x-3 p-4 bg-gray-50 rounded-lg ${
              onAlertClick ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
            }`}
            onClick={() => onAlertClick?.(alert)}
          >
            <div className="flex-shrink-0">
              {getTypeIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <Badge variant={getSeverityColor(alert.severity)} size="sm">
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
              {(alert.farmName || alert.warehouseName) && (
                <p className="text-xs text-gray-400 mt-1">
                  {[alert.farmName, alert.warehouseName].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}