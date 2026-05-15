import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { getTransfers, initiateTransfer } from '@/lib/dataService'

export async function GET(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access
    await withFarmAccess(userId, farmId, 'supervisor')

    const { searchParams } = new URL(req.url)
    const filters = {
      farm_id: farmId,
      status: searchParams.get('status') || undefined,
      from_date: searchParams.get('from_date') || undefined,
      to_date: searchParams.get('to_date') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    const transfers = await getTransfers(filters)
    return NextResponse.json(transfers)
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access with supervisor role for transfers
    await withFarmAccess(userId, farmId, 'supervisor')

    const body = await req.json()
    const transferData = {
      farm_origin_id: farmId,
      warehouse_origin_id: body.warehouse_origin_id,
      farm_dest_id: body.farm_dest_id,
      warehouse_dest_id: body.warehouse_dest_id,
      product_id: body.product_id,
      quantity: body.quantity,
      reason: body.reason
    }

    const transfer = await initiateTransfer(userId, transferData)
    return NextResponse.json(transfer, { status: 201 })
  })
}