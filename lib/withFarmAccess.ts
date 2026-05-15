import { getUserFarmAccess } from './dataService'
import type { UserFarmAccess } from './types'

export async function withFarmAccess(
  userId: string,
  farmId: string,
  minRole?: 'trabajador' | 'supervisor' | 'admin' | 'propietario'
): Promise<UserFarmAccess> {
  const accesses = await getUserFarmAccess(userId)
  const access = accesses.find(a => a.farm_id === farmId)

  if (!access) {
    throw new Error('Access denied: user does not have access to this farm')
  }

  if (minRole) {
    const roleHierarchy = { trabajador: 1, supervisor: 2, admin: 3, propietario: 4 }
    if (roleHierarchy[access.role] < roleHierarchy[minRole]) {
      throw new Error(`Access denied: requires ${minRole} role or higher`)
    }
  }

  return access
}