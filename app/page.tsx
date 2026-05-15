'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { KpiCard, AlertsPanel, RecentMovements } from '@/components/dashboard'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import type { DashboardKPIs } from '@/lib/types'

interface UserFarmAccess {
  id: string
  farm_id: string
  role: string
}

interface MeResponse {
  user: {
    id: string
    name: string
    email: string
    is_active: boolean
    last_login_at?: string
  }
  farms: UserFarmAccess[]
}

interface Alert {
  id: string
  type: 'low_stock' | 'pending_transfer' | 'system'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  farmName?: string
  warehouseName?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const loadDashboardData = useCallback(async () => {
    try {
      const meResponse = await fetch('/api/auth/me')
      if (!meResponse.ok) {
        addToast('No se pudo cargar el usuario', 'error')
        setLoading(false)
        return
      }

      const meData = await meResponse.json() as MeResponse
      const isPropietario = meData.farms.some(f => f.role === 'propietario')
      const savedFarmId = typeof window !== 'undefined' ? localStorage.getItem('activeFarmId') : null
      const dashboardUrl = new URL('/api/dashboard', window.location.origin)

      if (!isPropietario && savedFarmId) {
        dashboardUrl.searchParams.set('farmId', savedFarmId)
      }

      const response = await fetch(dashboardUrl.toString())
      if (response.ok) {
        const data = await response.json()
        setKpis(data.kpis)

        // Generate alerts based on KPIs
        const newAlerts: Alert[] = []
        if (data.kpis.low_stock_alerts > 0) {
          newAlerts.push({
            id: 'low-stock',
            type: 'low_stock',
            title: 'Productos con stock bajo',
            description: `${data.kpis.low_stock_alerts} productos necesitan reposición`,
            severity: 'medium'
          })
        }
        if (data.kpis.pending_transfers > 0) {
          newAlerts.push({
            id: 'pending-transfers',
            type: 'pending_transfer',
            title: 'Transferencias pendientes',
            description: `${data.kpis.pending_transfers} transferencias requieren aprobación`,
            severity: 'low'
          })
        }
        setAlerts(newAlerts)
      } else {
        addToast('Error al cargar datos del dashboard', 'error')
      }
    } catch (error) {
      addToast('Error de conexión', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleAlertClick = (alert: Alert) => {
    if (alert.type === 'pending_transfer') {
      // Get the active farm ID from localStorage
      const activeFarmId = typeof window !== 'undefined' ? localStorage.getItem('activeFarmId') : null
      if (activeFarmId) {
        router.push(`/farms/${activeFarmId}/transfers/pending`)
      } else {
        addToast('Selecciona una finca para ver transferencias pendientes', 'warning')
      }
    } else if (alert.type === 'low_stock') {
      // Navigate to inventory page
      const activeFarmId = typeof window !== 'undefined' ? localStorage.getItem('activeFarmId') : null
      if (activeFarmId) {
        router.push(`/farms/${activeFarmId}/inventory`)
      } else {
        addToast('Selecciona una finca para ver el inventario', 'warning')
      }
    }
  }

  const handleNavigate = (path: string) => {
    const activeFarmId = typeof window !== 'undefined' ? localStorage.getItem('activeFarmId') : null
    if (!activeFarmId) {
      addToast('Selecciona una finca activa primero', 'warning')
      return
    }

    router.push(`/farms/${activeFarmId}${path}`)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Fincas"
            value={kpis?.farms_count || 0}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <KpiCard
            title="Bodegas"
            value={kpis?.warehouses_count || 0}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />

          <KpiCard
            title="Productos"
            value={kpis?.products_count || 0}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />

          <KpiCard
            title="Valor Total"
            value={`$${kpis?.total_stock_value?.toLocaleString() || 0}`}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {kpis?.pending_transfers !== undefined && (
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 cursor-pointer hover:bg-emerald-50" onClick={() => handleNavigate('/transfers/pending')}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transferencias pendientes</p>
                  <p className="text-3xl font-semibold text-gray-900">{kpis.pending_transfers}</p>
                  <p className="mt-2 text-sm text-gray-500">Solicitudes inter-finca que requieren aprobación.</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m0 0l3-3m-3 3l3 3m6-9v6a2 2 0 01-2 2h-2" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Alerts and Recent Movements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsPanel alerts={alerts} onAlertClick={handleAlertClick} />

          <RecentMovements movements={kpis?.recent_movements || []} />
        </div>

        {/* Quick Actions */}
        <Card title="Acciones Rápidas" className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleNavigate('/movements/new')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <svg className="h-8 w-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Nuevo Movimiento</span>
            </button>

            <button
              onClick={() => handleNavigate('/transfers/new')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <svg className="h-8 w-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Nueva Transferencia</span>
            </button>

            <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <svg className="h-8 w-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Agregar Producto</span>
            </button>

            <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <svg className="h-8 w-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Ver Reportes</span>
            </button>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}