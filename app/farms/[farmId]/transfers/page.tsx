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

type Transfer = {
  id: string
  farm_origin: { name: string }
  farm_dest: { name: string }
  warehouse_origin: { name: string }
  warehouse_dest: { name: string }
  user: { full_name: string }
  status: 'pendiente' | 'aprobada' | 'rechazada'
  is_intrafarm: boolean
  created_at: string
  quantity?: number
  product?: { code?: string; name?: string }
  transfer_items?: Array<{
    quantity: number
    product: { code: string; name: string }
  }>
}

export default function TransfersPage() {
  const params = useParams() as { farmId: string }
  const searchParams = useSearchParams()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    from_date: searchParams.get('from_date') || '',
    to_date: searchParams.get('to_date') || ''
  })
  const { addToast } = useToast()

  useEffect(() => {
    loadTransfers()
  }, [params.farmId, filters])

  const loadTransfers = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.set('status', filters.status)
      if (filters.from_date) queryParams.set('from_date', filters.from_date)
      if (filters.to_date) queryParams.set('to_date', filters.to_date)

      const response = await fetch(`/api/farms/${params.farmId}/transfers?${queryParams}`)
      if (!response.ok) {
        throw new Error('Error al cargar transferencias')
      }

      const data = await response.json()
      setTransfers(data)
    } catch (error) {
      addToast('Error al cargar transferencias', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge variant="warning">Pendiente</Badge>
      case 'aprobada':
        return <Badge variant="success">Aprobada</Badge>
      case 'rechazada':
        return <Badge variant="error">Rechazada</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
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

  const getTransferType = (isIntrafarm: boolean) => {
    return isIntrafarm ? 'Intra-finca' : 'Inter-finca'
  }

  const columns = [
    { key: 'created_at', header: 'Fecha', sortable: true },
    { key: 'type', header: 'Tipo', sortable: true },
    { key: 'origin', header: 'Origen', sortable: true },
    { key: 'destination', header: 'Destino', sortable: true },
    { key: 'products', header: 'Productos', sortable: true },
    { key: 'user', header: 'Iniciado por', sortable: true },
    { key: 'status', header: 'Estado', sortable: true }
  ]

  const data = transfers.map(transfer => ({
    ...transfer,
    created_at: formatDate(transfer.created_at),
    type: getTransferType(transfer.is_intrafarm),
    origin: `${transfer.farm_origin.name} - ${transfer.warehouse_origin.name}`,
    destination: `${transfer.farm_dest.name} - ${transfer.warehouse_dest.name}`,
    products: transfer.transfer_items ? transfer.transfer_items.map(item =>
      `${item.product.code} (${item.quantity})`
    ).join(', ') : `${transfer.product?.code || 'N/A'} (${transfer.quantity})`,
    user: transfer.user.full_name,
    status: getStatusBadge(transfer.status)
  }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Transferencias</h1>
            <p className="text-sm text-gray-500">Historial completo de transferencias entre bodegas y fincas.</p>
          </div>
          <Link href={`/farms/${params.farmId}/transfers/new`}>
            <Button>Nueva Transferencia</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card title="Filtros" className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
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

        {/* Transfers Table */}
        <Card title={`Transferencias (${transfers.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={data}
              emptyMessage="No hay transferencias registradas"
            />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}