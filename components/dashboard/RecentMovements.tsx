import { Card } from '../ui/Card'
import { Table } from '../ui/Table'
import type { Movement } from '@/lib/types'

interface RecentMovementsProps {
  movements: Movement[]
  className?: string
}

export function RecentMovements({ movements, className = '' }: RecentMovementsProps) {
  const columns = [
    {
      key: 'created_at',
      header: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (value: string) => {
        const typeLabels = {
          entrada: 'Entrada',
          salida: 'Salida',
          ajuste: 'Ajuste',
          transferencia_salida: 'Transferencia Salida',
          transferencia_entrada: 'Transferencia Entrada'
        }
        return typeLabels[value as keyof typeof typeLabels] || value
      }
    },
    {
      key: 'subtype',
      header: 'Subtipo',
      render: (value: string | null) => value || '-'
    },
    {
      key: 'quantity',
      header: 'Cantidad',
      render: (_: any, movement: Movement) => movement.quantity || 0
    },
    {
      key: 'user_id',
      header: 'Usuario',
      render: (_: any, movement: Movement) => movement.user_id || 'Sistema'
    }
  ]

  return (
    <Card title="Movimientos Recientes" className={className}>
      <Table
        data={movements}
        columns={columns}
        emptyMessage="No hay movimientos recientes"
      />
    </Card>
  )
}