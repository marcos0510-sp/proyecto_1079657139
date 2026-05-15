'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'

type Farm = {
  id: string
  name: string
  role: string
}

export default function FarmDetailPage() {
  const params = useParams() as { farmId: string }
  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    async function loadFarm() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          throw new Error('No autorizado')
        }

        const data = await response.json()
        const selectedFarm = (data.farms || []).find((item: any) => item.id === params.farmId)

        if (!selectedFarm) {
          setError('No tienes acceso a esta finca.')
          return
        }

        setFarm(selectedFarm)
      } catch (err) {
        addToast('Error al cargar la finca', 'error')
        setError('No se pudo cargar la finca.')
      } finally {
        setLoading(false)
      }
    }

    loadFarm()
  }, [params.farmId, addToast])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Finca</h1>
            <p className="text-sm text-gray-500">Gestión y navegación de la finca seleccionada.</p>
          </div>
          <Link href="/farms" className="text-sm text-emerald-600 hover:underline">
            Volver a mis fincas
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
          </div>
        ) : error ? (
          <Card title="Acceso denegado" className="bg-white">
            <p className="text-sm text-gray-600">{error}</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card title={farm?.name || 'Finca'} className="bg-white">
              <p className="text-sm text-gray-500">ID: {farm?.id}</p>
              <p className="text-sm text-gray-500">Rol: {farm?.role}</p>
            </Card>

            <Card title="Acciones rápidas" className="bg-white">
              <div className="space-y-3">
                <Link href={`/farms/${params.farmId}/inventory`} className="block text-sm text-emerald-600 hover:underline">
                  Ver inventario
                </Link>
                <Link href={`/farms/${params.farmId}/movements`} className="block text-sm text-emerald-600 hover:underline">
                  Ver movimientos
                </Link>
                <Link href={`/farms/${params.farmId}/transfers`} className="block text-sm text-emerald-600 hover:underline">
                  Ver transferencias
                </Link>
                <Link href={`/farms/${params.farmId}/users`} className="block text-sm text-emerald-600 hover:underline">
                  Ver usuarios
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
