import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { withFarmAccess } from '@/lib/withFarmAccess'
import { getMovements, registerMovement } from '@/lib/dataService'

export async function GET(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access
    await withFarmAccess(userId, farmId, 'trabajador')

    const { searchParams } = new URL(req.url)
    const filters = {
      farm_id: farmId,
      warehouse_id: searchParams.get('warehouse_id') || undefined,
      product_id: searchParams.get('product_id') || undefined,
      type: searchParams.get('type') as 'entrada' | 'salida' | 'ajuste' | undefined,
      from_date: searchParams.get('from_date') || undefined,
      to_date: searchParams.get('to_date') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      user_id: userId
    }

    const movements = await getMovements(filters)
    return NextResponse.json(movements)
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { farmId: string } }
) {
  return withAuth(req, async (req) => {
    const { farmId } = params
    const userId = req.user.userId

    // Verify farm access with supervisor role for movements
    await withFarmAccess(userId, farmId, 'supervisor')

    const body = await req.json()
    const movementData = {
      farm_id: farmId,
      warehouse_id: body.warehouse_id,
      product_id: body.product_id,
      type: body.type,
      quantity: body.quantity,
      reason: body.reason
    }

    const movement = await registerMovement(userId, movementData)
    return NextResponse.json(movement, { status: 201 })
  })
}