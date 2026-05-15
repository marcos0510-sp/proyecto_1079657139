import { NextRequest, NextResponse } from 'next/server'
import { getUserFarmAccess } from './dataService'
import { withAuth, AuthenticatedRequest } from './withAuth'

export async function withRole(
  req: NextRequest,
  handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response> | Response,
  allowedRoles: ('propietario' | 'admin' | 'supervisor' | 'trabajador')[],
  farmId?: string,
  ...args: any[]
): Promise<Response> {
  return withAuth(req, async (req) => {
    const { userId } = req.user

    if (farmId) {
      const accesses = await getUserFarmAccess(userId)
      const access = accesses.find(a => a.farm_id === farmId)

      if (!access || !allowedRoles.includes(access.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      // For system-wide checks (like bootstrap), check if user has any propietario role
      const accesses = await getUserFarmAccess(userId)
      const hasRole = accesses.some(a => allowedRoles.includes(a.role))

      if (!hasRole) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return handler(req, ...args)
  }, ...args)
}