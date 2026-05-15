'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { SeedModeBanner } from './SeedModeBanner'
import { ToastProvider } from './ui/Toast'
import { ToastContainer } from './ui/ToastContainer'

interface User {
  id: string
  name: string
  email: string
  farms: Array<{
    id: string
    name: string
    role: string
  }>
}

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [activeFarmId, setActiveFarmId] = useState<string>('')
  const [pendingTransfersCount, setPendingTransfersCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (!pathname || !user) return

    const match = pathname.match(/^\/farms\/([^\/]+)/)
    if (match) {
      const farmId = match[1]
      if (user.farms.some(f => f.id === farmId)) {
        setActiveFarmId(farmId)
        localStorage.setItem('activeFarmId', farmId)
      }
    }
  }, [pathname, user])

  useEffect(() => {
    if (!activeFarmId || !user) return

    const rolesWithPendingAccess = ['supervisor', 'admin', 'propietario']
    const activeFarm = user.farms.find(f => f.id === activeFarmId)
    if (!activeFarm || !rolesWithPendingAccess.includes(activeFarm.role)) {
      setPendingTransfersCount(0)
      return
    }

    const loadPendingCount = async () => {
      try {
        const response = await fetch(`/api/farms/${activeFarmId}/transfers/pending`)
        if (response.ok) {
          const data = await response.json()
          setPendingTransfersCount(Array.isArray(data) ? data.length : 0)
        }
      } catch {
        setPendingTransfersCount(0)
      }
    }

    loadPendingCount()
  }, [activeFarmId, user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)

        // Set active farm to the first one or from localStorage
        const savedFarmId = localStorage.getItem('activeFarmId')
        const farms = userData.farms
        if (savedFarmId && farms.some((f: any) => f.id === savedFarmId)) {
          setActiveFarmId(savedFarmId)
        } else if (farms.length > 0) {
          setActiveFarmId(farms[0].id)
          localStorage.setItem('activeFarmId', farms[0].id)
        }
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleFarmChange = (farmId: string) => {
    setActiveFarmId(farmId)
    localStorage.setItem('activeFarmId', farmId)
    router.push(`/farms/${farmId}`)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('activeFarmId')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeFarm = user.farms.find(f => f.id === activeFarmId)
  const userRole = activeFarm?.role || 'trabajador'

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <SeedModeBanner />

        <div className="flex">
          <Sidebar
            userRole={userRole}
            activeFarmName={activeFarm?.name || 'Sin finca seleccionada'}
            activeFarmId={activeFarmId}
            pendingTransfersCount={pendingTransfersCount}
          />

          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeFarm?.name || 'AgroStock Pro'}
                  </h2>

                  {/* Farm selector */}
                  {user.farms.length > 1 && (
                    <select
                      value={activeFarmId}
                      onChange={(e) => handleFarmChange(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {user.farms.map(farm => (
                        <option key={farm.id} value={farm.id}>
                          {farm.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {user.name} ({userRole})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>

        <ToastContainer />
      </div>
    </ToastProvider>
  )
}