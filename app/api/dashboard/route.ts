import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getUserFarmAccess, getDashboardKPIs } from '@/lib/dataService'

export async function GET(req: NextRequest) {
  return withAuth(req, async (req) => {
    const { searchParams } = new URL(req.url)
    const farmId = searchParams.get('farmId')

    const userId = req.user.userId
    const accesses = await getUserFarmAccess(userId)

    if (!accesses.length) {
      return NextResponse.json({ error: 'No farm access' }, { status: 403 })
    }

    // Determine which farms to show data for based on role
    let targetFarmIds: string[]

    if (farmId) {
      // Specific farm requested - verify access
      const access = accesses.find(a => a.farm_id === farmId)
      if (!access) {
        return NextResponse.json({ error: 'Access denied to farm' }, { status: 403 })
      }
      targetFarmIds = [farmId]
    } else {
      // No specific farm - show data based on highest role
      const propietarioFarms = accesses.filter(a => a.role === 'propietario').map(a => a.farm_id)
      const adminFarms = accesses.filter(a => a.role === 'admin').map(a => a.farm_id)

      if (propietarioFarms.length > 0) {
        // Propietario sees all their farms
        targetFarmIds = propietarioFarms
      } else if (adminFarms.length > 0) {
        // Admin sees their admin farms
        targetFarmIds = adminFarms
      } else {
        // Others see their accessible farms
        targetFarmIds = accesses.map(a => a.farm_id)
      }
    }

    const kpis = await getDashboardKPIs(targetFarmIds)

    return NextResponse.json({
      kpis,
      farms: targetFarmIds.length,
      userAccess: accesses
    })
  })
}