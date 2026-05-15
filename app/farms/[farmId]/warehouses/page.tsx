'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Warehouse = {
  id: string
  name: string
  description?: string
  capacity_max?: number
  created_at?: string
}

export default function WarehousesPage() {
  const params = useParams() as { farmId: string }
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', capacity_max: '' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => { loadWarehouses() }, [params.farmId])

  const loadWarehouses = async () => {
    try {
      const res = await fetch(`/api/farms/${params.farmId}/warehouses`)
      if (!res.ok) throw new Error('Error al cargar bodegas')
      const data = await res.json()
      setWarehouses(data)
    } catch (err) {
      addToast('Error al cargar bodegas', 'error')
    } finally { setLoading(false) }
  }

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body: any = { name: form.name, description: form.description }
      if (form.capacity_max) body.capacity_max = parseFloat(form.capacity_max)

      const res = await fetch(`/api/farms/${params.farmId}/warehouses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })

      if (res.ok) {
        addToast('Bodega creada', 'success')
        setForm({ name: '', description: '', capacity_max: '' })
        loadWarehouses()
      } else {
        const err = await res.json()
        addToast(err.error || 'Error al crear bodega', 'error')
      }
    } catch {
      addToast('Error al crear bodega', 'error')
    } finally { setSaving(false) }
  }

  const columns = [
    { key: 'name', header: 'Nombre' },
    { key: 'description', header: 'Descripción' },
    { key: 'capacity_max', header: 'Capacidad' },
    { key: 'created_at', header: 'Creada' }
  ]

  const data = warehouses.map(w => ({ ...w, capacity_max: w.capacity_max ?? '-' }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bodegas</h1>
            <p className="text-sm text-gray-500">Gestiona las bodegas de la finca.</p>
          </div>
        </div>

        <Card title="Nueva bodega" className="bg-white">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input required value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad máxima</label>
                <input type="number" step="0.01" value={form.capacity_max} onChange={(e) => handleChange('capacity_max', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear bodega'}</Button>
            </div>
          </form>
        </Card>

        <Card title={`Bodegas (${warehouses.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
          ) : (
            <Table columns={columns} data={data} emptyMessage="No hay bodegas" />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
