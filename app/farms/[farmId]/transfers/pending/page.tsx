'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'

interface Transfer {
  id: string
  created_at: string
  status: 'pendiente' | 'aprobada' | 'rechazada'
  quantity: number
  reason?: string
  farm_origin: { name: string }
  farm_dest: { name: string }
  warehouse_origin: { name: string }
  warehouse_dest: { name: string }
  product: { code: string; name: string }
  user: { full_name: string }
}

export default function PendingTransfersPage() {
  const params = useParams() as { farmId: string }
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    loadPendingTransfers()
  }, [params.farmId])

  const loadPendingTransfers = useCallback(async () => {
    try {
      const response = await fetch(`/api/farms/${params.farmId}/transfers/pending`)
      if (response.ok) {
        const data = await response.json()
        setTransfers(data)
      } else {
        addToast('Error al cargar transferencias pendientes', 'error')
      }
    } catch (error) {
      addToast('Error al cargar transferencias pendientes', 'error')
    } finally {
      setLoading(false)
    }
  }, [params.farmId, addToast])

  const handleApprove = async (transferId: string) => {
    setProcessing(transferId)
    try {
      const response = await fetch(`/api/farms/${params.farmId}/transfers/${transferId}/approve`, {
        method: 'POST'
      })

      if (response.ok) {
        addToast('Transferencia aprobada exitosamente', 'success')
        loadPendingTransfers() // Reload the list
      } else {
        const error = await response.json()
        addToast(error.error || 'Error al aprobar transferencia', 'error')
      }
    } catch (error) {
      addToast('Error al aprobar transferencia', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (transferId: string) => {
    const reason = prompt('Motivo del rechazo:')
    if (!reason || reason.trim().length === 0) {
      return
    }

    setProcessing(transferId)
    try {
      const response = await fetch(`/api/farms/${params.farmId}/transfers/${transferId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        addToast('Transferencia rechazada', 'success')
        loadPendingTransfers() // Reload the list
      } else {
        const error = await response.json()
        addToast(error.error || 'Error al rechazar transferencia', 'error')
      }
    } catch (error) {
      addToast('Error al rechazar transferencia', 'error')
    } finally {
      setProcessing(null)
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
    { key: 'origin', header: 'Origen', sortable: true },
    { key: 'destination', header: 'Destino', sortable: true },
    { key: 'product', header: 'Producto', sortable: true },
    { key: 'quantity', header: 'Cantidad', sortable: true },
    { key: 'user', header: 'Solicitado por', sortable: true },
    { key: 'actions', header: 'Acciones', sortable: false }
  ]

  const data = transfers.map(transfer => ({
    ...transfer,
    created_at: formatDate(transfer.created_at),
    origin: `${transfer.farm_origin.name} - ${transfer.warehouse_origin.name}`,
    destination: `${transfer.farm_dest.name} - ${transfer.warehouse_dest.name}`,
    product: `${transfer.product.code} - ${transfer.product.name}`,
    quantity: transfer.quantity,
    user: transfer.user.full_name,
    actions: (
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleApprove(transfer.id)}
          disabled={processing === transfer.id}
        >
          {processing === transfer.id ? 'Procesando...' : 'Aprobar'}
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleReject(transfer.id)}
          disabled={processing === transfer.id}
        >
          Rechazar
        </Button>
      </div>
    )
  }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Transferencias Pendientes</h1>
            <p className="text-sm text-gray-500">Transferencias inter-finca que requieren aprobación.</p>
          </div>
          <Link href={`/farms/${params.farmId}/transfers`}>
            <Button variant="secondary">Ver Todas las Transferencias</Button>
          </Link>
        </div>

        <Card title="Transferencias Pendientes de Aprobación">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={data}
              emptyMessage="No hay transferencias pendientes de aprobación"
            />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}