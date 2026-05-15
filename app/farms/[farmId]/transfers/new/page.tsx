'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Farm = {
  id: string
  name: string
}

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

export default function NewTransferPage() {
  const params = useParams() as { farmId: string }
  const router = useRouter()
  const [farms, setFarms] = useState<Farm[]>([])
  const [originWarehouses, setOriginWarehouses] = useState<Warehouse[]>([])
  const [destinationWarehouses, setDestinationWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    farm_dest_id: params.farmId,
    warehouse_origin_id: '',
    warehouse_dest_id: '',
    product_id: '',
    quantity: '',
    reason: ''
  })
  const { addToast } = useToast()

  const loadFarms = useCallback(async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const data = await response.json()
        setFarms(data)
      }
    } catch (error) {
      addToast('Error al cargar fincas', 'error')
    }
  }, [addToast])

  const loadOriginWarehouses = useCallback(async () => {
    try {
      const response = await fetch(`/api/farms/${params.farmId}/warehouses`)
      if (response.ok) {
        const data = await response.json()
        setOriginWarehouses(data)
        if (!formData.farm_dest_id || formData.farm_dest_id === params.farmId) {
          setDestinationWarehouses(data)
        }
      }
    } catch (error) {
      addToast('Error al cargar bodegas', 'error')
    }
  }, [params.farmId, addToast, formData.farm_dest_id])

  const loadDestinationWarehouses = useCallback(async (farmId: string) => {
    try {
      const response = await fetch(`/api/farms/${farmId}/warehouses`)
      if (response.ok) {
        const data = await response.json()
        setDestinationWarehouses(data)
      }
    } catch (error) {
      addToast('Error al cargar bodegas de destino', 'error')
    }
  }, [addToast])

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/farms/${params.farmId}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      addToast('Error al cargar productos', 'error')
    }
  }, [params.farmId, addToast])

  useEffect(() => {
    loadFarms()
    loadOriginWarehouses()
    loadProducts()
  }, [loadFarms, loadOriginWarehouses, loadProducts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.warehouse_origin_id && formData.warehouse_origin_id === formData.warehouse_dest_id) {
      addToast('La bodega de origen y destino no pueden ser la misma', 'warning')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/farms/${params.farmId}/transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          farm_dest_id: formData.farm_dest_id,
          warehouse_origin_id: formData.warehouse_origin_id,
          warehouse_dest_id: formData.warehouse_dest_id,
          product_id: formData.product_id,
          quantity: parseFloat(formData.quantity),
          reason: formData.reason
        })
      })

      if (response.ok) {
        addToast('Transferencia iniciada exitosamente', 'success')
        router.push(`/farms/${params.farmId}/transfers`)
      } else {
        const error = await response.json()
        addToast(error.error || 'Error al iniciar transferencia', 'error')
      }
    } catch (error) {
      addToast('Error al iniciar transferencia', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'farm_dest_id') {
      setFormData(prev => ({ ...prev, farm_dest_id: value, warehouse_dest_id: '' }))

      if (!value || value === params.farmId) {
        setDestinationWarehouses(originWarehouses)
      } else {
        loadDestinationWarehouses(value)
      }
      return
    }

    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isInterFarm = formData.farm_dest_id && formData.farm_dest_id !== params.farmId

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Nueva Transferencia</h1>
            <p className="text-sm text-gray-500">Inicia una transferencia de productos entre bodegas.</p>
          </div>
        </div>

        <Card title="Detalles de la Transferencia" className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finca Destino *
                </label>
                <select
                  value={formData.farm_dest_id}
                  onChange={(e) => handleChange('farm_dest_id', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar finca destino</option>
                  {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bodega Origen *
                </label>
                <select
                  value={formData.warehouse_origin_id}
                  onChange={(e) => handleChange('warehouse_origin_id', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar bodega origen</option>
                  {originWarehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bodega Destino *
                </label>
                <select
                  value={formData.warehouse_dest_id}
                  onChange={(e) => handleChange('warehouse_dest_id', e.target.value)}
                  required
                  disabled={!formData.farm_dest_id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Seleccionar bodega destino</option>
                  {destinationWarehouses.map(warehouse => (
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

              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Tipo de Transferencia: {isInterFarm ? 'Inter-finca' : 'Intra-finca'}
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        {isInterFarm ? (
                          <p>Esta transferencia requiere aprobación del administrador de la finca destino. El stock quedará reservado hasta su resolución.</p>
                        ) : (
                          <p>Esta transferencia se ejecutará inmediatamente entre bodegas de la misma finca.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
                placeholder="Describe el motivo de la transferencia..."
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
                {loading ? 'Iniciando...' : 'Iniciar Transferencia'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}