'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'

type Farm = {
  id: string
  name: string
  role: string
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    async function loadFarms() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          throw new Error('No se pudo cargar las fincas')
        }

        const data = await response.json()
        setFarms(data.farms || [])
      } catch (error) {
        addToast('Error al cargar fincas', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadFarms()
  }, [addToast])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Fincas</h1>
            <p className="text-sm text-gray-500">Selecciona una finca para ver su inventario y operaciones.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
          </div>
        ) : farms.length === 0 ? (
          <Card title="No hay fincas disponibles" className="bg-white">
            <p className="text-sm text-gray-600">No tienes acceso a ninguna finca en este momento.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {farms.map((farm) => (
              <Card key={farm.id} title={farm.name} className="bg-white">
                <p className="text-sm text-gray-500">Rol: {farm.role}</p>
                <Link href={`/farms/${farm.id}`} className="inline-flex mt-4 items-center px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                  Ir a la finca
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
