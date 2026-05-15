'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface SidebarItem {
  name: string
  icon: ReactNode
  roles: ('trabajador' | 'supervisor' | 'admin' | 'propietario')[]
  getHref: (farmId: string) => string
}

interface SidebarProps {
  userRole: string
  activeFarmName: string
  activeFarmId: string
  pendingTransfersCount?: number
}

const sidebarItems: Array<SidebarItem & { getHref: (farmId: string) => string }> = [
  {
    name: 'Dashboard',
    getHref: (farmId) => (farmId ? `/farms/${farmId}` : '/'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
      </svg>
    ),
    roles: ['trabajador', 'supervisor', 'admin', 'propietario']
  },
  {
    name: 'Inventario',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/inventory` : '/inventory'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    roles: ['trabajador', 'supervisor', 'admin', 'propietario']
  },
  {
    name: 'Movimientos',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/movements` : '/movements'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    roles: ['trabajador', 'supervisor', 'admin', 'propietario']
  },
  {
    name: 'Transferencias',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/transfers` : '/transfers'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    roles: ['supervisor', 'admin', 'propietario']
  },
  {
    name: 'Transferencias pendientes',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/transfers/pending` : '/transfers/pending'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
      </svg>
    ),
    roles: ['supervisor', 'admin', 'propietario']
  },
  {
    name: 'Bodegas',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/warehouses` : '/warehouses'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    roles: ['admin', 'propietario']
  },
  {
    name: 'Categorías',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/categories` : '/categories'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    roles: ['admin', 'propietario']
  },
  {
    name: 'Productos',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/products` : '/products'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    roles: ['admin', 'propietario']
  },
  {
    name: 'Usuarios',
    getHref: (farmId) => (farmId ? `/farms/${farmId}/users` : '/users'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    roles: ['admin', 'propietario']
  },
  {
    name: 'Fincas',
    getHref: () => '/farms',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    roles: ['propietario']
  },
  {
    name: 'Auditoría',
    getHref: () => '/audit',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    roles: ['propietario']
  },
  {
    name: 'Sistema',
    getHref: () => '/admin/db-setup',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: ['propietario']
  }
]

export function Sidebar({ userRole, activeFarmName, activeFarmId, pendingTransfersCount = 0 }: SidebarProps) {
  const pathname = usePathname()

  const filteredItems = sidebarItems.filter(item =>
    item.roles.includes(userRole as any)
  )

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
        <h1 className="text-xl font-bold">AgroStock Pro</h1>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {filteredItems.map((item) => {
            const href = item.getHref(activeFarmId)
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={item.name}
                href={href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3 flex items-center gap-2">
                  {item.name}
                  {item.name === 'Transferencias pendientes' && pendingTransfersCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {pendingTransfersCount}
                    </span>
                  )}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 p-4 bg-gray-900">
        <div className="text-xs text-gray-400">
          Finca activa:
        </div>
        <div className="text-sm font-medium text-white truncate">
          {activeFarmName}
        </div>
        <div className="text-xs text-gray-400 mt-1 capitalize">
          Rol: {userRole}
        </div>
      </div>
    </div>
  )
}