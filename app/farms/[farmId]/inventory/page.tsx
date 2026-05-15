'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

type StockItem = {
  id: string
  product_id: string
  product_code: string
  product_name: string
  warehouse_id: string
  warehouse_name: string
  category_name: string
  current_stock: number
  min_stock: number
  price_ref: number
  last_movement: string
}

export default function InventoryPage() {
  const params = useParams() as { farmId: string }
  const searchParams = useSearchParams()
  const [inventory, setInventory] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    warehouse_id: searchParams.get('warehouse_id') || '',
    category_id: searchParams.get('category_id') || '',
    product_code: searchParams.get('product_code') || '',
    low_stock_only: searchParams.get('low_stock_only') === 'true'
  })
  const { addToast } = useToast()

  useEffect(() => {
    loadInventory()
  }, [params.farmId, filters])

  const loadInventory = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.warehouse_id) queryParams.set('warehouse_id', filters.warehouse_id)
      if (filters.category_id) queryParams.set('category_id', filters.category_id)
      if (filters.product_code) queryParams.set('product_code', filters.product_code)
      if (filters.low_stock_only) queryParams.set('low_stock_only', 'true')

      const response = await fetch(`/api/farms/${params.farmId}/inventory?${queryParams}`)
      if (!response.ok) {
        throw new Error('Error al cargar inventario')
      }

      const data = await response.json()
      setInventory(data)
    } catch (error) {
      addToast('Error al cargar inventario', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { label: 'Sin stock', variant: 'error' as const }
    if (current <= min) return { label: 'Stock bajo', variant: 'warning' as const }
    return { label: 'En stock', variant: 'success' as const }
  }

  const columns = [
    { key: 'product_code', header: 'Código', sortable: true },
    { key: 'product_name', header: 'Producto', sortable: true },
    { key: 'warehouse_name', header: 'Bodega', sortable: true },
    { key: 'category_name', header: 'Categoría', sortable: true },
    { key: 'current_stock', header: 'Stock Actual', sortable: true },
    { key: 'min_stock', header: 'Stock Mínimo', sortable: true },
    { key: 'price_ref', header: 'Precio Ref.', sortable: true },
    { key: 'status', header: 'Estado' }
  ]

  const data = inventory.map(item => ({
    ...item,
    price_ref: `$${item.price_ref?.toLocaleString() || 0}`,
    status: (
      <Badge variant={getStockStatus(item.current_stock, item.min_stock).variant}>
        {getStockStatus(item.current_stock, item.min_stock).label}
      </Badge>
    )
  }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
            <p className="text-sm text-gray-500">Vista completa del stock por producto y bodega.</p>
          </div>
        </div>

        {/* Filters */}
        <Card title="Filtros" className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Categoría
              </label>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todas las categorías</option>
                {/* TODO: Load categories dynamically */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de producto
              </label>
              <input
                type="text"
                value={filters.product_code}
                onChange={(e) => handleFilterChange('product_code', e.target.value)}
                placeholder="Buscar por código..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.low_stock_only}
                  onChange={(e) => handleFilterChange('low_stock_only', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo stock bajo</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card title={`Productos en inventario (${inventory.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={data}
              emptyMessage="No hay productos en inventario"
            />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}