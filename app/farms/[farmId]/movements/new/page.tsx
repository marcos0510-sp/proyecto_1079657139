'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Warehouse = {
  id: string
  name: string
}

type Product = {
  id: string
  code: string
  name: string
  unit: string
}

export default function NewMovementPage() {
  const params = useParams() as { farmId: string }
  const router = useRouter()
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    warehouse_id: '',
    product_id: '',
    type: 'entrada',
    quantity: '',
    reason: ''
  })
  const { addToast } = useToast()

  useEffect(() => {
    loadWarehouses()
    loadProducts()
  }, [params.farmId])

  const loadWarehouses = async () => {
    try {
      const response = await fetch(`/api/farms/${params.farmId}/warehouses`)
      if (response.ok) {
        const data = await response.json()
        setWarehouses(data)
      }
    } catch (error) {
      addToast('Error al cargar bodegas', 'error')
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/farms/${params.farmId}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      addToast('Error al cargar productos', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/farms/${params.farmId}/movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          warehouse_id: formData.warehouse_id,
          product_id: formData.product_id,
          type: formData.type,
          quantity: parseFloat(formData.quantity),
          reason: formData.reason
        })
      })

      if (response.ok) {
        addToast('Movimiento registrado exitosamente', 'success')
        router.push(`/farms/${params.farmId}/movements`)
      } else {
        const error = await response.json()
        addToast(error.error || 'Error al registrar movimiento', 'error')
      }
    } catch (error) {
      addToast('Error al registrar movimiento', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Nuevo Movimiento</h1>
            <p className="text-sm text-gray-500">Registra una entrada, salida o ajuste de inventario.</p>
          </div>
        </div>

        <Card title="Detalles del Movimiento" className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bodega *
                </label>
                <select
                  value={formData.warehouse_id}
                  onChange={(e) => handleChange('warehouse_id', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar bodega</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => handleChange('product_id', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.code} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Movimiento *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                required
                rows={3}
                placeholder="Describe el motivo del movimiento..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar Movimiento'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}