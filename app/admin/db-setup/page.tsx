'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'

interface ServiceStatus {
  name: string
  status: 'ok' | 'error' | 'unknown'
  message: string
  details?: string
}

interface SystemInfo {
  mode: 'seed' | 'live'
  services: ServiceStatus[]
  canBootstrap: boolean
}

export default function DbSetupPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [bootstrapping, setBootstrapping] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadSystemInfo()
  }, [])

  const loadSystemInfo = async () => {
    try {
      const [modeResponse, diagnoseResponse] = await Promise.all([
        fetch('/api/system/mode'),
        fetch('/api/system/diagnose')
      ])

      const modeData = await modeResponse.json()
      const diagnoseData = await diagnoseResponse.json()

      setSystemInfo({
        mode: modeData.mode,
        services: diagnoseData.services || [],
        canBootstrap: diagnoseData.canBootstrap
      })
    } catch (error) {
      addToast('Error al cargar información del sistema', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBootstrap = async () => {
    if (!systemInfo?.canBootstrap) return

    setBootstrapping(true)
    try {
      const response = await fetch('/api/system/bootstrap', {
        method: 'POST'
      })

      if (response.ok) {
        addToast('Sistema inicializado correctamente', 'success')
        await loadSystemInfo() // Recargar la información
        setTimeout(() => router.push('/'), 2000) // Redirigir al dashboard
      } else {
        const error = await response.json()
        addToast(`Error al inicializar: ${error.error}`, 'error')
      }
    } catch (error) {
      addToast('Error de conexión al inicializar el sistema', 'error')
    } finally {
      setBootstrapping(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!systemInfo) {
    return (
      <EmptyState
        icon={
          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
        title="Error al cargar información del sistema"
        description="No se pudo obtener el estado del sistema. Verifique la conexión."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="mt-2 text-gray-600">
          Diagnóstico y configuración inicial de AgroStock Pro
        </p>
      </div>

      {/* System Mode */}
      <Card title="Estado del Sistema">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Modo actual:</span>
            <div className="mt-1">
              <Badge variant={systemInfo.mode === 'live' ? 'success' : 'warning'}>
                {systemInfo.mode === 'live' ? 'Producción' : 'Demo'}
              </Badge>
            </div>
          </div>
          {systemInfo.mode === 'seed' && (
            <div>
              <span className="text-sm font-medium text-gray-500">Estado:</span>
              <div className="mt-1">
                <Badge variant={systemInfo.canBootstrap ? 'info' : 'error'}>
                  {systemInfo.canBootstrap ? 'Listo para inicializar' : 'Requiere configuración'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Services Status */}
      <Card title="Estado de Servicios">
        <div className="space-y-4">
          {systemInfo.services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === 'ok' ? 'bg-green-500' :
                  service.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.message}</p>
                  {service.details && (
                    <p className="text-xs text-gray-400 mt-1">{service.details}</p>
                  )}
                </div>
              </div>
              <Badge variant={
                service.status === 'ok' ? 'success' :
                service.status === 'error' ? 'error' : 'neutral'
              }>
                {service.status === 'ok' ? 'OK' :
                 service.status === 'error' ? 'Error' : 'Desconocido'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Bootstrap Action */}
      {systemInfo.mode === 'seed' && systemInfo.canBootstrap && (
        <Card title="Inicialización del Sistema">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.502-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Inicialización requerida
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      El sistema está en modo demo. Para activar el modo producción, debe inicializar la base de datos con las tablas y datos base.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleBootstrap}
                disabled={bootstrapping}
                variant="primary"
              >
                {bootstrapping ? 'Inicializando...' : 'Inicializar Sistema'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {systemInfo.mode === 'live' && (
        <Card title="Sistema Configurado">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Sistema operativo
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    El sistema está completamente configurado y listo para usar en modo producción.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}