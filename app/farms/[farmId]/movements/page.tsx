'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Movement = {
  id: string
  product_id: string
  product_code: string
  product_name: string
  warehouse_id: string
  warehouse_name: string
  type: 'entrada' | 'salida' | 'ajuste'
  quantity: number
  reason: string
  user_id: string
  user_name: string
  created_at: string
}

export default function MovementsPage() {
  const params = useParams() as { farmId: string }
  const searchParams = useSearchParams()
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    warehouse_id: searchParams.get('warehouse_id') || '',
    product_id: searchParams.get('product_id') || '',
    type: searchParams.get('type') || '',
    from_date: searchParams.get('from_date') || '',
    to_date: searchParams.get('to_date') || ''
  })
  const { addToast } = useToast()

  useEffect(() => {
    loadMovements()
  }, [params.farmId, filters])

  const loadMovements = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.warehouse_id) queryParams.set('warehouse_id', filters.warehouse_id)
      if (filters.product_id) queryParams.set('product_id', filters.product_id)
      if (filters.type) queryParams.set('type', filters.type)
      if (filters.from_date) queryParams.set('from_date', filters.from_date)
      if (filters.to_date) queryParams.set('to_date', filters.to_date)

      const response = await fetch(`/api/farms/${params.farmId}/movements?${queryParams}`)
      if (!response.ok) {
        throw new Error('Error al cargar movimientos')
      }

      const data = await response.json()
      setMovements(data)
    } catch (error) {
      addToast('Error al cargar movimientos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'entrada':
        return <Badge variant="success">Entrada</Badge>
      case 'salida':
        return <Badge variant="warning">Salida</Badge>
      case 'ajuste':
        return <Badge variant="secondary">Ajuste</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns = [
    { key: 'created_at', header: 'Fecha', sortable: true },
    { key: 'product_code', header: 'Producto', sortable: true },
    { key: 'warehouse_name', header: 'Bodega', sortable: true },
    { key: 'type', header: 'Tipo', sortable: true },
    { key: 'quantity', header: 'Cantidad', sortable: true },
    { key: 'reason', header: 'Motivo', sortable: true },
    { key: 'user_name', header: 'Usuario', sortable: true }
  ]

  const data = movements.map(movement => ({
    ...movement,
    created_at: formatDate(movement.created_at),
    type: getMovementTypeBadge(movement.type),
    quantity: movement.type === 'salida' ? `-${movement.quantity}` : `+${movement.quantity}`
  }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Movimientos</h1>
            <p className="text-sm text-gray-500">Historial completo de entradas, salidas y ajustes de inventario.</p>
          </div>
          <Link href={`/farms/${params.farmId}/movements/new`}>
            <Button>Nuevo Movimiento</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card title="Filtros" className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bodega
              </label>
              <select
                value={filters.warehouse_id}
                onChange={(e) => handleFilterChange('warehouse_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todas las bodegas</option>
                {/* TODO: Load warehouses dynamically */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                value={filters.product_id}
                onChange={(e) => handleFilterChange('product_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todos los productos</option>
                {/* TODO: Load products dynamically */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todos los tipos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                value={filters.from_date}
                onChange={(e) => handleFilterChange('from_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleFilterChange('to_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Movements Table */}
        <Card title={`Movimientos (${movements.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={data}
              emptyMessage="No hay movimientos registrados"
            />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}