import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getUserFarmAccessWithFarm } from '@/lib/dataService'

export async function GET(req: NextRequest) {
  return withAuth(req, async (req) => {
    const userId = req.user.userId
    const accesses = await getUserFarmAccessWithFarm(userId)

    const farms = accesses
      .filter((access, index, arr) => arr.findIndex(a => a.farm_id === access.farm_id) === index)
      .map(access => ({
        id: access.farm_id,
        name: access.farm_name || 'Finca sin nombre'
      }))

    return NextResponse.json(farms)
  })
}