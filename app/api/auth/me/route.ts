import { NextRequest, NextResponse } from 'next/server'
import { getUserById, getUserFarmAccessWithFarm } from '@/lib/dataService'
import { withAuth } from '@/lib/withAuth'

export async function GET(req: NextRequest) {
  return withAuth(req, async (req) => {
    const { userId } = req.user

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const accesses = await getUserFarmAccessWithFarm(userId)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        last_login_at: user.last_login_at
      },
      farms: accesses.map(access => ({
        id: access.farm_id,
        name: access.farm_name,
        role: access.role
      }))
    })
  })
}