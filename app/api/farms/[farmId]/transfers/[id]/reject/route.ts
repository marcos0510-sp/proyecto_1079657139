import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { rejectTransfer } from '@/lib/transferService'

export async function POST(
  req: NextRequest,
  { params }: { params: { farmId: string; id: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId, id } = params
    const userId = req.user.userId

    // Verify farm access with supervisor role
    await withFarmAccess(userId, farmId, 'supervisor')

    const body = await req.json()
    const { reason } = body

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
    }

    const transfer = await rejectTransfer(id, userId, reason)
    return NextResponse.json(transfer)
  })
}