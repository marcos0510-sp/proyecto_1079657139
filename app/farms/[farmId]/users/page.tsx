'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

type User = {
  id: string
  name: string
  email: string
  is_active: boolean
  last_login_at?: string
}

export default function UsersPage() {
  const params = useParams() as { farmId: string }
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'supervisor' | 'trabajador'>('trabajador')
  const [invitingSending, setInviteSending] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [params.farmId])

  const loadUsers = async () => {
    try {
      const response = await fetch(`/api/farms/${params.farmId}/users`)
      if (!response.ok) {
        throw new Error('Error al cargar usuarios')
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      addToast('Error al cargar usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) {
      addToast('Ingresa un email', 'error')
      return
    }

    setInviteSending(true)
    try {
      const response = await fetch(`/api/farms/${params.farmId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
      })

      if (response.ok) {
        addToast('Invitación enviada exitosamente', 'success')
        setInviteEmail('')
        setInviteRole('trabajador')
        loadUsers()
      } else {
        const error = await response.json()
        addToast(error.error || 'Error al enviar invitación', 'error')
      }
    } catch (error) {
      addToast('Error al enviar invitación', 'error')
    } finally {
      setInviteSending(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns = [
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'is_active', header: 'Estado' },
    { key: 'last_login_at', header: 'Último acceso' }
  ]

  const data = users.map(user => ({
    ...user,
    is_active: (
      <Badge variant={user.is_active ? 'success' : 'error'}>
        {user.is_active ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    last_login_at: formatDate(user.last_login_at)
  }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-500">Invita y gestiona usuarios de la finca.</p>
          </div>
        </div>

        {/* Invite Form */}
        <Card title="Invitar usuario" className="bg-white">
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="usuario@ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="trabajador">Trabajador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={invitingSending}
                  className="w-full"
                >
                  {invitingSending ? 'Enviando...' : 'Enviar invitación'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Users Table */}
        <Card title={`Usuarios (${users.length})`} className="bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={data}
              emptyMessage="No hay usuarios en esta finca"
            />
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
