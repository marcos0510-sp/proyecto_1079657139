import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { approveTransfer } from '@/lib/transferService'

export async function POST(
  req: NextRequest,
  { params }: { params: { farmId: string; id: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId, id } = params
    const userId = req.user.userId

    // Verify farm access with supervisor role
    await withFarmAccess(userId, farmId, 'supervisor')

    const transfer = await approveTransfer(id, userId)
    return NextResponse.json(transfer)
  })
}