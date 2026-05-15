'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Product = {
  id: string
  code: string
  name: string
  unit: string
  price_ref?: number
  min_stock?: number
  created_at?: string
}

type Warehouse = { id: string; name: string }
type Category = { id: string; name: string }

export default function ProductsPage() {
  const params = useParams() as { farmId: string }
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ code: '', name: '', unit: '', price_ref: '', min_stock: '', initial_stock: '', warehouse_id: '', category_id: '' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => { loadAll() }, [params.farmId])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [pRes, wRes, cRes] = await Promise.all([
        fetch(`/api/farms/${params.farmId}/products`),
        fetch(`/api/farms/${params.farmId}/warehouses`),
        fetch(`/api/farms/${params.farmId}/categories`)
      ])

      if (!pRes.ok) throw new Error('Error al cargar productos')

      const pData = await pRes.json()
      const wData = wRes.ok ? await wRes.json() : []
      const cData = cRes.ok ? await cRes.json() : []

      setProducts(pData)
      setWarehouses(wData)
      setCategories(cData)
    } catch (err) {
      addToast('Error al cargar datos de productos', 'error')
    } finally { setLoading(false) }
  }

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body: any = {
        code: form.code,
        name: form.name,
        unit: form.unit
      }
      if (form.price_ref) body.price_ref = parseFloat(form.price_ref)
      if (form.min_stock) body.min_stock = parseFloat(form.min_stock)
      if (form.initial_stock) body.initial_stock = parseFloat(form.initial_stock)
      if (form.warehouse_id) body.warehouse_id = form.warehouse_id
      if (form.category_id) body.category_id = form.category_id

      const res = await fetch(`/api/farms/${params.farmId}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) {
        addToast('Producto creado', 'success')
        setForm({ code: '', name: '', unit: '', price_ref: '', min_stock: '', initial_stock: '', warehouse_id: '', category_id: '' })
        loadAll()
      } else {
        const err = await res.json()
        addToast(err.error || 'Error al crear producto', 'error')
      }
    } catch {
      addToast('Error al crear producto', 'error')
    } finally { setSaving(false) }
  }

  const columns = [
    { key: 'code', header: 'Código' },
    { key: 'name', header: 'Nombre' },
    { key: 'unit', header: 'Unidad' },
    { key: 'price_ref', header: 'Precio' }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500">Gestiona el catálogo de productos.</p>
          </div>
        </div>

        <Card title="Nuevo producto" className="bg-white">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                <input required value={form.code} onChange={(e) => handleChange('code', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input required value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
                <input required value={form.unit} onChange={(e) => handleChange('unit', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio referencia</label>
                <input type="number" step="0.01" value={form.price_ref} onChange={(e) => handleChange('price_ref', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock mínimo</label>
                <input type="number" step="0.01" value={form.min_stock} onChange={(e) => handleChange('min_stock', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock inicial</label>
                <input type="number" step="0.01" value={form.initial_stock} onChange={(e) => handleChange('initial_stock', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bodega inicial</label>
                <select value={form.warehouse_id} onChange={(e) => handleChange('warehouse_id', e.target.value)} className="w-full px-3 py-2 border rounded">
                  <option value="">Seleccionar bodega</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)} className="w-full px-3 py-2 border rounded">
                  <option value="">Sin categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear producto'}</Button>
              </div>
            </div>
          </form>
        </Card>

        <Card title={`Productos (${products.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
          ) : (
            <Table columns={columns} data={products} emptyMessage="No hay productos" />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
