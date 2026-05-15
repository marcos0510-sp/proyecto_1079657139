'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Category = {
  id: string
  name: string
  created_at?: string
}

export default function CategoriesPage() {
  const params = useParams() as { farmId: string }
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => { loadCategories() }, [params.farmId])

  const loadCategories = async () => {
    try {
      const res = await fetch(`/api/farms/${params.farmId}/categories`)
      if (!res.ok) throw new Error('Error al cargar categorías')
      const data = await res.json()
      setCategories(data)
    } catch {
      addToast('Error al cargar categorías', 'error')
    } finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) { addToast('Nombre requerido', 'error'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/farms/${params.farmId}/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (res.ok) {
        addToast('Categoría creada', 'success')
        setName('')
        loadCategories()
      } else {
        const err = await res.json()
        addToast(err.error || 'Error al crear categoría', 'error')
      }
    } catch {
      addToast('Error al crear categoría', 'error')
    } finally { setSaving(false) }
  }

  const columns = [{ key: 'name', header: 'Nombre' }, { key: 'created_at', header: 'Creada' }]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Categorías</h1>
            <p className="text-sm text-gray-500">Gestiona las categorías de productos.</p>
          </div>
        </div>

        <Card title="Nueva categoría" className="bg-white">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div className="flex items-end md:col-span-2">
                <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear categoría'}</Button>
              </div>
            </div>
          </form>
        </Card>

        <Card title={`Categorías (${categories.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
          ) : (
            <Table columns={columns} data={categories} emptyMessage="No hay categorías" />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
